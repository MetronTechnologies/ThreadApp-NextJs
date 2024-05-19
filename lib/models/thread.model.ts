const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const threadSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
});
const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);
export default Thread;