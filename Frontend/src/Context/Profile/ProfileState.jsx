import React, { useState } from 'react'
import ProfileContext from './ProfileContext'
import { GetUserProfile, UpdateUserProfile } from '../../Api/ProfileAPI';

const ProfileState = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    // Function 1: Get User Profile
    const fetchUserProfile = async (userId) => {
        setIsLoading(true);

        try {
            const result = await GetUserProfile(userId);
            console.log("Fetch User Profile Result:", result);

            if (result.success) {
                return { success: true, profile: result.profile };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.log("Error fetching user profile:", error);
            return { success: false, error: "An unexpected error occurred while fetching the profile." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 2: Update User Profile
    const updateUserProfile = async (userId, profileData) => {
        setIsLoading(true);

        try {
            const result = await UpdateUserProfile(userId, profileData);
            console.log("Update User Profile Result:", result);

            if (result.success) {
                return { success: true, profile: result.profile };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.log("Error updating user profile:", error);
            return { success: false, error: "An unexpected error occurred while updating the profile." };
        } finally {
            setIsLoading(false);
        }
    }

    const value = {
        fetchUserProfile,
        updateUserProfile,
        isLoading
    }

    return (
        <ProfileContext.Provider value={value}>
            {props.children}
        </ProfileContext.Provider>
    )
}

export default ProfileState
