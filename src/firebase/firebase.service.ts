// firebase-service.ts
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase-config';

export class FirebaseService {
  async uploadImage(
    file: ExpressHelper.MulterFile,
    path: string,
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: file.mimetype.split('/')[1],
      };
      const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}
export const firebaseService = new FirebaseService();
