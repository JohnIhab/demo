export type SignUpType = {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber:string;
    password: string;
    avatar?: string;
    role?: string;
    confirm: string;
    schooleYear:string;
}

export type LoginType = {
    identifier: string;
    password: string;
}
export type verifyEmailType = {
    token: string;
};

export type forgetEmailType = {
    email: string;
}


export type resetEmailType = {
    email: string;
    password: string; 
    confirm: string;
}

