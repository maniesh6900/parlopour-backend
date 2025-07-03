export class ApiResponse {
    public success : Boolean
    constructor ( 
        public  statusCode : Number,
        public data: Object,
        public message : String
    ){
        this.message = message
        this.statusCode = statusCode
        this.data = data
        this.success = true
    }
}