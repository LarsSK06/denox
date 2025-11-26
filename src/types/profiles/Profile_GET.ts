type Profile_GET = {
    id: number;
    name: string;
    token: string;
    secret: string;
    createdAt: number;
    editedAt: number | null;
};

export default Profile_GET;