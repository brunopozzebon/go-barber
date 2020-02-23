import moongoose from 'mongoose';

const notificationSchema = moongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default moongoose.model('Notifications', notificationSchema);
