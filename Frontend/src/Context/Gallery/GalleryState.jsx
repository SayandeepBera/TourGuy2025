import React, { useState } from 'react'
import GalleryContext from './GalleryContext'
import { UploadGalleryImage, DeleteGalleryImage, GetAllGalleryImages, GetGalleryImagesByCategory } from '../../Api/GalleryAPI';

const GalleryState = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    // Fuction 1: Upload gallery image
    const uploadGalleryImage = async (bookingId, galleryFormData) => {
        try {
            const result = await UploadGalleryImage(bookingId, galleryFormData);
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            return { success: false, msg: "Failed to upload gallery image due to a server error." };
        }
    }

    // Fuction 2: Delete gallery image
    const deleteGalleryImage = async (id) => {
        try {
            const result = await DeleteGalleryImage(id);
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            return { success: false, msg: "Failed to delete gallery image due to a server error." };
        }
    }

    // Fuction 3: Get all gallery images
    const getAllGalleryImages = async () => {
        try {
            const result = await GetAllGalleryImages();
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            return { success: false, msg: "Failed to get all gallery images due to a server error." };
        }
    }

    // Fuction 4: Get gallery images by category
    const getGalleryImagesByCategory = async (category) => {
        setIsLoading(true);
        
        try {
            const result = await GetGalleryImagesByCategory(category);
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            return { success: false, msg: "Failed to get gallery images by category due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    const value = {
        uploadGalleryImage,
        deleteGalleryImage,
        getAllGalleryImages,
        getGalleryImagesByCategory,
        isLoading
    }

  return (
    <GalleryContext.Provider value={value} >
        {props.children}
    </GalleryContext.Provider>
  )
}

export default GalleryState;
