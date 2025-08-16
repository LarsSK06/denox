type ProfileGetModel = {
    id: number;
    name: string;
    token: string;
    secret: string;
    createdAt: number;
    editedAt: number | null;
};

export default ProfileGetModel;