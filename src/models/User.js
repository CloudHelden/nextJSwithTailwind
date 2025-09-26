// models/User.js
import mongoose from 'mongoose'

// Schema = Wie soll ein User aussehen?
const userSchema = new mongoose.Schema({
    // Pflichtfelder
    name: {
        type: String,
        required: [true, 'Name ist erforderlich'],
        minlength: [2, 'Name muss mindestens 2 Zeichen haben']
    },

    email: {
        type: String,
        required: [true, 'Email ist erforderlich'],
        unique: true,  // Keine doppelten Emails!
        lowercase: true,  // Automatisch kleinschreiben
        match: [/^\S+@\S+\.\S+$/, 'Bitte gültige Email eingeben']
    },

    password: {
        type: String,
        required: [true, 'Passwort ist erforderlich'],
        minlength: [6, 'Passwort muss mindestens 6 Zeichen haben'],
        select: false  // Passwort wird standardmäßig nicht zurückgegeben
    },

    // Profilbild als Base64 String
    profilePicture: {
        type: String,  // Base64 encoded image
        default: null
    },

    // Optionale Felder
    alter: {
        type: Number,
        min: [0, 'Alter kann nicht negativ sein'],
        max: [120, 'Alter muss realistisch sein']
    },

    // Mit Standardwert
    registriertAm: {
        type: Date,
        default: Date.now  // Automatisch aktuelles Datum
    },

    // Listen
    hobbies: [String],  // Array von Strings

    // Verschachtelte Objekte
    adresse: {
        straße: String,
        plz: String,
        stadt: String,
        land: {
            type: String,
            default: 'Deutschland'
        }
    },

    // Referenzen zu anderen Dokumenten
    lieblingsPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'  // Verweist auf Post-Model
    }]
})

// Model erstellen
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User