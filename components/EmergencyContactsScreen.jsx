import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import firebaseApp from "../firebase";

export default function EmergencyContactsScreen({ onBack }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  // Load contacts from Firestore on mount
  useEffect(() => {
    async function loadContacts() {
      if (!user) return;
      const docRef = doc(db, "emergencyContacts", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContacts(docSnap.data().contacts || []);
      }
    }
    loadContacts();
  }, [user]);

  const validatePhone = (number) => /^\d{10,}$/.test(number);

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter both name and phone number."
      );
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert(
        "Validation Error",
        "Phone number must be at least 10 digits and contain numbers only."
      );
      return;
    }
    const newContacts = [
      ...contacts,
      { id: Date.now().toString(), name: name.trim(), phone: phone.trim() },
    ];
    setContacts(newContacts);
    setName("");
    setPhone("");
    // Save immediately to Firestore
    if (user) {
      const docRef = doc(db, "emergencyContacts", user.uid);
      await setDoc(docRef, { contacts: newContacts });
    }
  };

  const handleRemove = async (id) => {
    const newContacts = contacts.filter((c) => c.id !== id);
    setContacts(newContacts);
    // Save immediately to Firestore
    if (user) {
      const docRef = doc(db, "emergencyContacts", user.uid);
      await setDoc(docRef, { contacts: newContacts });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Emergency Contacts</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts added.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.contactRow}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ marginBottom: 24 }}
      />

      <Text style={styles.addTitle}>Add New Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: { marginBottom: 16 },
  backButtonText: { color: "#2730d5", fontSize: 16, fontWeight: "bold" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2730d5",
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f8f9fb",
    borderRadius: 8,
    padding: 10,
  },
  contactName: { fontSize: 16, fontWeight: "bold" },
  contactPhone: { fontSize: 14, color: "#555" },
  removeText: { color: "#d32f2f", fontWeight: "bold" },
  emptyText: { color: "#888", fontStyle: "italic", marginBottom: 8 },
  addTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#f8f9fb",
  },
  addButton: {
    backgroundColor: "#2730d5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});
