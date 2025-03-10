export interface Photo_Model {
    _id?: string; // NeDB 會自動產生 _id
    upload_datetime?: Date;
    class_type?: string;
    tags?: string;
    description?: string;
    file_urt?: string;
}