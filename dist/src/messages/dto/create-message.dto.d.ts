export declare class CreateMessageDto {
    candidateId: string;
    applicationId?: string;
    type: string;
    title: string;
    body: string;
    channelApp?: boolean;
    channelSms?: boolean;
    channelEmail?: boolean;
    companyId?: string;
}
