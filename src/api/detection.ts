import { apiHost } from 'config/appConfig';

export async function detectWordsOnImage(imageUri: string): Promise<string[]> {
    const formData: any = new FormData();
    const fileType = imageUri.substring(imageUri.lastIndexOf('.') + 1);
    formData.append('image', { uri: imageUri, name: `image.${fileType}`, type: `image/${fileType}` });

    const response = await fetch(`${apiHost}/api/detect`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    const responseJson = await response.json();
    if (response.status !== 200) {
        throw new Error(responseJson.errorMessage);
    }

    return responseJson.words;
}
