type ProfileGetModel = {
    id: number;
    name: string;
    isPasswordProtected: boolean;
    token: string;
    secret: string;
    createdAt: number;
    editedAt: number | null;
};

export default ProfileGetModel;