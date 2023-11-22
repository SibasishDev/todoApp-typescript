import { bucket } from "./firebase.init";

export const uploadImageToBucket = async (file: any, path: string) => {
    return new Promise((resolve, reject) => {
        const fileName = path + "-images/" + Date.now() + ".webp";
        const fileUpload = bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file?.mimetype,
                cacheControl: 'public, max-age=31536000'
            }
        });

        stream.on('error', (err) => {
            console.error('Error uploading to Firebase:', err);
            reject(new Error('Error uploading to Firebase:'));
        });

        stream.on('finish', async () => {
            await fileUpload.makePublic();
            // File uploaded successfully
            const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(downloadUrl);
        });

        if (file && file.buffer) {
            stream.end(file.buffer);
        } else {
            reject(new Error('File or buffer is missing.'));
        }
    });

}

export const deleteImageFromBucket = async (filePath: string): Promise<string> => {

    return new Promise(async (resolve, reject) => {

        try {
            
            const file = bucket.file(filePath);

            const [exist] = await file.exists();

            if (exist) {
                await file.delete();
                resolve(`File ${filePath} successfully deleted.`);
            } else {
                resolve(`File ${filePath} does not exist.`);
            }

        } catch (e) {
            console.log("Error during image deletion :" + e);
            reject(new Error("Error during image deletion"));
        }

    })
}