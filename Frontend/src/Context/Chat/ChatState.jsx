import React from 'react';
import ChatContext from './ChatContext';
import { CreateNewConversation, SaveMessage, GetMyConversations, GetMessages, MarkAllMessagesAsRead } from '../../Api/ChatAPI';

const ChatState = (props) => {
    // Function 1: Create a new conversation
    const createNewConversation = async (receiverId) => {
        try {
            console.log("Receiver Id: ", receiverId);
            const response = await CreateNewConversation(receiverId);
            console.log(response);

            if (response.success) {
                return { success: true, message: "Conversation created successfully!", newConversation: response.conversation };
            } else {
                return { success: false, message: "Conversation creation failed!", error: response.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: "Failed to create conversation due to a server error." };
        }
    }

    // Function 2: Save message
    const saveMessage = async (formData) => {
        try {
            const response = await SaveMessage(formData);
            console.log(response);

            if (response.success) {
                return { success: true, message: "Message saved successfully!", newMessage: response.newMessage };
            } else {
                return { success: false, message: "Message saving failed!", error: response.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: "Failed to save message due to a server error." };
        }
    }

    // Function 3: Get my conversations
    const getMyConversations = async () => {
        try {
            const response = await GetMyConversations();
            console.log(response);

            if (response.success) {
                return { success: true, conversations: response.conversation };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: "Failed to get conversations due to a server error." };
        }
    }

    // Function 4: Get all conversations
    const getMessages = async (conversationId) => {
        try {
            const response = await GetMessages(conversationId);
            console.log(response);

            if (response.success) {
                return { success: true, messages: response.messages };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: "Failed to get conversations due to a server error." };
        }
    }

    // Function 5: Mark all messages in a conversation as read
    const markAllMessagesAsRead = async (conversationId) => {
        try {
            const response = await MarkAllMessagesAsRead(conversationId);
            console.log(response);

            if (response.success) {
                return { success: true, message: "Messages marked as read" };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: "Failed to mark messages as read due to a server error." };
        }
    }

    const value = {
        createNewConversation,
        saveMessage,
        getMyConversations,
        getMessages,
        markAllMessagesAsRead
    }

    return (
        <ChatContext.Provider value={value}>
            {props.children}
        </ChatContext.Provider>
    )
}

export default ChatState
