import { apiClient } from '../config/api.config';

export enum EnterType {
    // Add your enter type enum values here
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    TICKET = 'TICKET'
}

export enum SpeakType {
    // Add your speak type enum values here
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    TICKET = 'TICKET'
}

export interface CreateOutpostParams {
    name: string;
    subject?: string;
    enter_type: EnterType;
    speak_type: SpeakType;
    is_recordable: boolean;
    has_adult_content: boolean;
    image?: string;
    scheduled_for?: number;
    tickets_to_enter: string[];
    tickets_to_speak: string[];
    tags: string[];
    luma_event_id?: string;
}

export interface UpdateOutpostParams {
    uuid: string;
    luma_event_id?: string;
    scheduled_for?: number;
    image?: string;
}

export interface ListOutpostsParams {
    page?: number;
    page_size?: number;
    user_id?: number;
    text?: string;
    tag_id?: number;
    include_archived?: boolean;
}

export interface InviteUserParams {
    outpost_uuid: string;
    invitee_user_uuid: string;
    can_speak: boolean;
}

export interface ReportOutpostParams {
    uuid: string;
    reasons: string[];
}

export const outpostService = {
    // Create outpost
    createOutpost: async (params: CreateOutpostParams) => {
        const response = await apiClient.post('/outposts/create', params);
        return response.data;
    },

    // Update outpost
    updateOutpost: async (params: UpdateOutpostParams) => {
        const response = await apiClient.post('/outposts/update', params);
        return response.data;
    },

    // List outposts
    listOutposts: async (params: ListOutpostsParams) => {
        const response = await apiClient.get('/outposts/list', { params });
        return response.data;
    },

    // Get outpost detail
    getOutpostDetail: async (uuid: string) => {
        const response = await apiClient.get('/outposts/detail', { params: { uuid } });
        return response.data;
    },

    // Add member
    addMember: async (uuid: string, inviterUuid?: string) => {
        const response = await apiClient.post('/outposts/add-member', { uuid, inviter_uuid: inviterUuid });
        return response.data;
    },

    // Invite user
    inviteUser: async (params: InviteUserParams) => {
        const response = await apiClient.post('/outposts/invite', params);
        return response.data;
    },

    // Set reminder
    setReminder: async (uuid: string, reminderOffsetMinutes?: number) => {
        const response = await apiClient.post('/outposts/set-reminder', {
            uuid,
            reminder_offset_minutes: reminderOffsetMinutes
        });
        return response.data;
    },

    // Report outpost
    reportOutpost: async (params: ReportOutpostParams) => {
        const response = await apiClient.post('/outposts/report', params);
        return response.data;
    }
}; 