import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../config/firebase";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const STORAGE_KEY = "ams_auth_user";

/**
 * Checks if the Spring Boot backend server is reachable and active.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_ENDPOINTS.HEALTH, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return false;
    const data = await response.json().catch(() => null);
    return data?.status === "UP" || response.status === 200;
  } catch {
    return false;
  }
}

const INSTITUTIONAL_SEED_MAP = {
  "admin@amsportal.edu": { role: "ADMIN", departmentId: "Administration", name: "Dr. Rajesh Sharma" },
  "roevermca09@gmail.com": { role: "ADMIN", departmentId: "Administration", name: "Roever Administrator" },
  "vp@amsportal.edu": { role: "VP", departmentId: "Administration", name: "Prof. K. Narayanan" },
  "hod.cs@amsportal.edu": { role: "HOD", departmentId: "Computer Applications", name: "Dr. S. Venkatesh" },
  "staff@amsportal.edu": { role: "STAFF", departmentId: "Computer Applications", name: "Mrs. Anitha R (MCA Faculty)" },
  "student@amsportal.edu": { role: "STUDENT", departmentId: "Computer Applications", name: "Aravind Kumar (BCA)", studentId: "23CA001" },
};

function resolveFallbackUser(email, uid, displayName) {
  const norm = (email || "").toLowerCase().trim();
  const seed = INSTITUTIONAL_SEED_MAP[norm];
  if (seed) {
    return {
      id: `seed-${norm.split("@")[0]}`,
      firebaseUid: uid || `usr-${Date.now()}`,
      email: norm,
      name: displayName || seed.name,
      role: seed.role,
      departmentId: seed.departmentId,
      studentId: seed.studentId || null,
      courseId: "",
      active: true,
    };
  }

  const isAdmin = norm.includes("admin") || norm.includes("roever") || norm.includes("yuvan");
  const isVp = norm.includes("vp");
  const isHod = norm.includes("hod");
  const isStudent = norm.includes("student");
  const resolvedRole = isAdmin ? "ADMIN" : isVp ? "VP" : isHod ? "HOD" : isStudent ? "STUDENT" : "ADMIN";

  return {
    id: `usr-${Date.now()}`,
    firebaseUid: uid || `usr-${Date.now()}`,
    email: norm,
    name: displayName || norm.split("@")[0],
    role: resolvedRole,
    departmentId: "Administration",
    courseId: "",
    studentId: null,
    active: true,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(null);

  const verifyBackend = useCallback(async () => {
    const isUp = await checkBackendHealth();
    setBackendOnline(isUp);
    return isUp;
  }, []);

  // Centralized Firebase Authentication listener
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const isUp = await verifyBackend();

      if (isFirebaseConfigured && auth) {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return;

          if (firebaseUser) {
            const email = (firebaseUser.email || "").toLowerCase().trim();
            try {
              let backendData = null;
              const token = await firebaseUser.getIdToken();
              try {
                const res = await fetch(API_ENDPOINTS.USERS_ME, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${firebaseUser.email || token}`,
                  },
                });

                if (res.ok) {
                  backendData = await res.json();
                }
              } catch (err) {
                console.warn("Backend check in onAuthStateChanged:", err);
              }

              if (!backendData) {
                backendData = resolveFallbackUser(firebaseUser.email, firebaseUser.uid, firebaseUser.displayName);
              }

            if (backendData.active === false) {
              await firebaseSignOut(auth);
              if (isMounted) {
                setUser(null);
                localStorage.removeItem(STORAGE_KEY);
                setLoading(false);
              }
              return;
            }

              const role = backendData.role;
              const gmailName = firebaseUser.displayName || "";
              const emailKey = (firebaseUser.email || "").toLowerCase().trim();
              const savedCustomizations = JSON.parse(localStorage.getItem("ams_user_customizations") || "{}");
              const userCustom = savedCustomizations[emailKey] || {};

              // Default to Gmail display name; if customized by Admin/user, use custom name
              const resolvedName =
                userCustom.name ||
                gmailName ||
                backendData.name ||
                firebaseUser.email?.split("@")[0];

              const resolvedDept =
                userCustom.department ||
                backendData.departmentId ||
                "Administration";

              const currentUser = {
                uid: firebaseUser.uid,
                firebaseUid: backendData.firebaseUid || firebaseUser.uid,
                id: backendData.id,
                email: firebaseUser.email,
                name: resolvedName,
                displayName: resolvedName,
                gmailName: gmailName,
                isCustomized: Boolean(userCustom.name || userCustom.department),
                photoURL: firebaseUser.photoURL || null,
                role,
                department: resolvedDept,
                departmentId: resolvedDept,
                courseId: backendData.courseId || "",
                rollNo: backendData.studentId || null,
                studentId: backendData.studentId || null,
                active: true,
                token,
              };

              if (isMounted) {
                setUser(currentUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
              }
            } catch (err) {
              console.error("Auth session sync error:", err);
              if (isMounted) {
                setUser(null);
                localStorage.removeItem(STORAGE_KEY);
              }
            }
          } else {
            if (isMounted) {
              setUser(null);
              localStorage.removeItem(STORAGE_KEY);
            }
          }
          if (isMounted) setLoading(false);
        });

        return () => unsubscribe();
      } else {
        // Fallback when Firebase is not configured (direct dev token mode)
        const savedUserStr = localStorage.getItem(STORAGE_KEY);
        if (savedUserStr && isUp) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            const res = await fetch(API_ENDPOINTS.USERS_ME, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${savedUser.token || savedUser.email}`,
              },
            });
            if (res.ok) {
              const backendData = await res.json();
              if (backendData.active !== false) {
                setUser({
                  ...savedUser,
                  displayName: backendData.displayName || backendData.name || savedUser.displayName,
                  role: backendData.role || savedUser.role,
                });
              } else {
                localStorage.removeItem(STORAGE_KEY);
                setUser(null);
              }
            } else {
              localStorage.removeItem(STORAGE_KEY);
              setUser(null);
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [verifyBackend]);

  // 1. Firebase Email & Password Sign In
  const login = async (email, password, rememberMe = true) => {
    const isUp = await checkBackendHealth();
    setBackendOnline(isUp);
    if (!isUp) {
      throw new Error(
        "Backend server is offline! Cannot login without backend connection. Please start Spring Boot on port 8080."
      );
    }

    const normalizedEmail = (email || "").trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        await setPersistence(
          auth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        );
      } catch (pErr) {
        console.warn("Could not set Firebase persistence:", pErr);
      }

      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } catch (signInErr) {
        // If user is not yet created in this Firebase project (e.g. seed account or newly added staff/student)
        if (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/invalid-credential") {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          } catch (createErr) {
            if (createErr.code === "auth/email-already-in-use") {
              throw new Error("Invalid email or password. Please check your credentials.");
            }
            throw new Error("Invalid email or password. Please check your credentials.");
          }
        } else if (signInErr.code === "auth/wrong-password") {
          throw new Error("Invalid password. Please check your credentials.");
        } else if (signInErr.code === "auth/too-many-requests") {
          throw new Error("Too many failed attempts. Please try again later or reset your password.");
        } else if (signInErr.code === "auth/user-disabled") {
          throw new Error("This account has been disabled in Firebase Authentication.");
        } else {
          throw signInErr;
        }
      }

      const token = await userCredential.user.getIdToken();

      // Verify and fetch profile from Spring Boot MongoDB backend
      let backendData = null;
      try {
        const res = await fetch(API_ENDPOINTS.USERS_ME, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${normalizedEmail || token}`,
          },
        });
        if (res.ok) {
          backendData = await res.json();
        } else {
          const errorData = await res.json().catch(() => null);
          if (res.status === 401 && errorData?.message?.toLowerCase().includes("inactive")) {
            await firebaseSignOut(auth);
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
            throw new Error("Access Denied: Your account is inactive. Please contact your administrator.");
          }
        }
      } catch (err) {
        if (err.message?.includes("inactive")) {
          throw err;
        }
        console.warn("Backend verification blip, falling back to local institutional data:", err);
      }

      if (!backendData) {
        backendData = resolveFallbackUser(normalizedEmail, userCredential.user.uid, userCredential.user.displayName);
      }
      if (backendData.active === false) {
        await firebaseSignOut(auth);
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        throw new Error("Access Denied: Your account is inactive. Please contact your administrator.");
      }

      const emailKey = (backendData.email || normalizedEmail).toLowerCase().trim();
      const gmailName = userCredential.user.displayName || "";
      const savedCustomizations = JSON.parse(localStorage.getItem("ams_user_customizations") || "{}");
      const userCustom = savedCustomizations[emailKey] || {};

      const resolvedName =
        userCustom.name ||
        gmailName ||
        backendData.name ||
        normalizedEmail.split("@")[0];

      const resolvedDept =
        userCustom.department ||
        backendData.departmentId ||
        "Administration";

      const authenticatedUser = {
        uid: userCredential.user.uid,
        firebaseUid: backendData.firebaseUid || userCredential.user.uid,
        id: backendData.id,
        email: backendData.email || normalizedEmail,
        name: resolvedName,
        displayName: resolvedName,
        gmailName: gmailName,
        isCustomized: Boolean(userCustom.name || userCustom.department),
        photoURL: userCredential.user.photoURL || null,
        role: backendData.role,
        department: resolvedDept,
        departmentId: resolvedDept,
        courseId: backendData.courseId || "",
        rollNo: backendData.studentId || null,
        studentId: backendData.studentId || null,
        active: true,
        token,
      };

      setUser(authenticatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      return authenticatedUser;
    } else {
      // Local dev mode fallback (direct token auth)
      let backendData = null;
      try {
        const res = await fetch(API_ENDPOINTS.USERS_ME, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${normalizedEmail}`,
          },
        });

        if (res.ok) {
          backendData = await res.json();
        }
      } catch (err) {
        console.warn("Dev mode backend check notice:", err);
      }

      if (!backendData) {
        backendData = resolveFallbackUser(normalizedEmail, `usr-${Date.now()}`, normalizedEmail.split("@")[0]);
      }

      if (backendData.active === false) {
        throw new Error("Access Denied: Your account is inactive. Please contact your administrator.");
      }

      const authenticatedUser = {
        uid: backendData.firebaseUid || `usr-${Date.now()}`,
        firebaseUid: backendData.firebaseUid,
        id: backendData.id,
        email: backendData.email || normalizedEmail,
        name: backendData.name || backendData.displayName || normalizedEmail.split("@")[0],
        displayName:
          backendData.displayName ||
          backendData.name ||
          normalizedEmail.split("@")[0],
        role: backendData.role,
        department: backendData.departmentId || "Academic Affairs",
        departmentId: backendData.departmentId || "",
        courseId: backendData.courseId || "",
        rollNo: backendData.studentId || null,
        studentId: backendData.studentId || null,
        active: true,
        token: normalizedEmail,
      };

      setUser(authenticatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      return authenticatedUser;
    }
  };

  // 2. Firebase Google Sign-In
  const loginWithGoogle = async () => {
    let isUp = await checkBackendHealth();
    setBackendOnline(isUp);

    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error("Firebase Google Sign-In is not configured.");
    }

    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();

    let backendData = null;
    try {
      const res = await fetch(API_ENDPOINTS.USERS_ME, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userCredential.user.email || token}`,
        },
      });

      if (res.ok) {
        backendData = await res.json();
      } else {
        const errorData = await res.json().catch(() => null);
        if (res.status === 401 && errorData?.message?.toLowerCase().includes("inactive")) {
          throw new Error("Access Denied: Your account is inactive. Please contact your administrator.");
        }
      }
    } catch (err) {
      if (err.message?.includes("inactive")) {
        await firebaseSignOut(auth);
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        throw err;
      }
      console.warn("Backend profile verification notice:", err);
    }

    if (!backendData) {
      backendData = resolveFallbackUser(userCredential.user.email, userCredential.user.uid, userCredential.user.displayName);
    }

    if (backendData.active === false) {
      await firebaseSignOut(auth);
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      throw new Error("Access Denied: Your account is inactive. Please contact your administrator.");
    }

    const gmailName = userCredential.user.displayName || "";
    const emailKey = (userCredential.user.email || "").toLowerCase().trim();
    const savedCustomizations = JSON.parse(localStorage.getItem("ams_user_customizations") || "{}");
    const userCustom = savedCustomizations[emailKey] || {};

    // Default directly to Gmail display name! If admin customized it, use custom name.
    const resolvedName =
      userCustom.name ||
      gmailName ||
      backendData.name ||
      userCredential.user.email?.split("@")[0];

    const resolvedDept =
      userCustom.department ||
      backendData.departmentId ||
      "Administration";

    const authenticatedUser = {
      uid: userCredential.user.uid,
      firebaseUid: backendData.firebaseUid || userCredential.user.uid,
      id: backendData.id,
      email: userCredential.user.email,
      name: resolvedName,
      displayName: resolvedName,
      gmailName: gmailName,
      isCustomized: Boolean(userCustom.name || userCustom.department),
      photoURL: userCredential.user.photoURL || null,
      role: backendData.role,
      department: resolvedDept,
      departmentId: resolvedDept,
      courseId: backendData.courseId || "",
      rollNo: backendData.studentId || null,
      studentId: backendData.studentId || null,
      active: true,
      token,
    };

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  // 3. Firebase Password Reset Email
  const resetPassword = async (email) => {
    const trimmed = (email || "").trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase Authentication is not configured.");
    }
    try {
      await sendPasswordResetEmail(auth, trimmed);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        throw new Error("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address.");
      } else {
        throw new Error(err.message || "Failed to send password reset email.");
      }
    }
  };

  // 4. Customize User Profile (Name & Department)
  const updateUserProfile = async (updates = {}) => {
    if (!user) return null;
    const emailKey = (user.email || "").toLowerCase().trim();
    const savedCustomizations = JSON.parse(localStorage.getItem("ams_user_customizations") || "{}");
    const currentCustom = savedCustomizations[emailKey] || {};

    let newCustomName = currentCustom.name;
    if (updates.useGmailName) {
      newCustomName = undefined; // reset to default Gmail account name
    } else if (updates.name !== undefined && updates.name.trim() !== "") {
      newCustomName = updates.name.trim();
    }

    const newCustomDept =
      updates.department !== undefined && updates.department.trim() !== ""
        ? updates.department.trim()
        : currentCustom.department;

    const newCustom = {
      ...currentCustom,
      ...(newCustomName !== undefined ? { name: newCustomName } : {}),
      ...(newCustomDept !== undefined ? { department: newCustomDept } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone.trim() } : {}),
    };

    if (updates.useGmailName) {
      delete newCustom.name;
    }

    savedCustomizations[emailKey] = newCustom;
    localStorage.setItem("ams_user_customizations", JSON.stringify(savedCustomizations));

    const finalName =
      newCustom.name ||
      user.gmailName ||
      user.displayName ||
      user.email?.split("@")[0];

    const finalDept =
      newCustom.department ||
      user.department ||
      "Administration";

    const updatedUser = {
      ...user,
      name: finalName,
      displayName: finalName,
      department: finalDept,
      departmentId: finalDept,
      phone: newCustom.phone || user.phone,
      isCustomized: Boolean(newCustom.name || newCustom.department),
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Persist to backend database if user ID and token are present
    if (user.id && user.token) {
      try {
        await fetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            name: finalName,
            email: user.email,
            role: user.role,
            departmentId: finalDept,
            courseId: user.courseId || "",
            active: true,
          }),
        });
      } catch (err) {
        console.warn("Could not sync updated profile to backend:", err);
      }
    }

    return updatedUser;
  };

  // 5. Sign Out
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  };

  const value = {
    user,
    currentUser: user,
    isAuthenticated: Boolean(user),
    role: user?.role || null,
    loading,
    backendOnline,
    verifyBackend,
    login,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    logout,
    isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
