//models/Post.js
import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true  // Add index for better query performance
    },

    content: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referenz zum User Model
        required: true
    },

    tags: [String],

    likes: {
        type: Number,
        default: 0
    },

    published: {
        type: Boolean,
        default: false
    },

    publishedAt: Date,

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true  // Fügt automatisch createdAt und updatedAt hinzu
})

// Methoden zum Model hinzufügen
postSchema.methods.publish = function() {
    this.published = true
    this.publishedAt = new Date()
    return this.save()
}

// Statische Methoden
postSchema.statics.findPublished = function() {
    return this.find({ published: true })
}

// Virtuelle Eigenschaften (werden nicht gespeichert)
postSchema.virtual('summary').get(function() {
    if (!this.content) return ''
    if (this.content.length <= 100) return this.content
    return this.content.substring(0, 100) + '...'
})

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

export default Post