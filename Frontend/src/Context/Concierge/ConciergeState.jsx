import React, { useState } from 'react'
import ConciergeContext from './ConciergeContext';
import { CreateConciergeRequest, GetAllConciergeRequests, UpdateConciergeRequestStatus } from '../../Api/ConciergeAPI';

const ConciergeState = (props) => {
    const [totalConciergeRequests, setTotalConciergeRequests] = useState(0);
    const [pendingConciergeRequests, setPendingConciergeRequests] = useState(0);

    // Function 1: Create Concierge Request
    const createConciergeRequest = async ({name, email, message}) => {
        try {
            const response = await CreateConciergeRequest(name, email, message);
            console.log(response);

            if (response.success) {
                return { success : true, message: "Request submitted successfully!", newRequest : response.newRequest };
            }else{
                return { success : false, message: "Request submission failed!", error : response.error };
            }
        } catch (error) {
            console.error("Error creating concierge request:", error);
            return { success : false, error : "Failed to create concierge request due to a server error." };
        }
    }

    // Function 2: Get All Concierge Requests
    const getAllConciergeRequests = async () => {
        try {
            const response = await GetAllConciergeRequests();
            console.log(response);

            if (response.success) {
                // Update total concierge requests
                setTotalConciergeRequests(response.conciergeRequests.length);

                // Update pending concierge requests
                const pendingRequests = response.conciergeRequests.filter(request => request.status === "pending");
                setPendingConciergeRequests(pendingRequests.length);

                return { success : true, requests : response.conciergeRequests };
            }else{
                return { success : false, error : response.error };
            }
        } catch (error) {
            console.error("Error fetching concierge requests:", error);
            return { success : false, error : "Failed to fetch concierge requests due to a server error." };
        }
    }

    // Function 3: Update Concierge Request Status
    const updateConciergeRequestStatus = async (requestId, status) => {
        try {
            const response = await UpdateConciergeRequestStatus(requestId, status);
            console.log(response);

            if (response.success) {
                return { success : true, updateRequest : response.updateRequest };
            }else{
                return { success : false, error : response.error };
            }
        } catch (error) {
            console.error("Error updating concierge request status:", error);
            return { success : false, error : "Failed to update concierge request status due to a server error." };
        }
    }

    // Context value
    const value = {
        createConciergeRequest,
        getAllConciergeRequests,
        updateConciergeRequestStatus,
        totalConciergeRequests,
        pendingConciergeRequests
    }

    return (
        <ConciergeContext.Provider value={value}>
            {props.children}
        </ConciergeContext.Provider>
    )
}

export default ConciergeState
