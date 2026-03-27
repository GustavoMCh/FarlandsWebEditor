import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: "user" | "admin";
    createdAt: number;
    publicMessage?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Obtener el perfil extendido desde Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                } else {
                    // Crear perfil por defecto si no existe
                    const newProfile: UserProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        role: "user",
                        createdAt: Date.now(),
                    };
                    await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
                    setProfile(newProfile);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, profile, loading };
}
