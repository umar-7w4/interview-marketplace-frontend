export interface LoginResponse {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    workEmail?: string;
    phoneNumber: string;
    profilePictureUrl?: string;
    preferredLanguage?: string;
    timezone?: string;
    createdAt: string;
    lastLogin?: string;
    role: string,
    status: string;
    idToken: string; 
    refreshToken: string; 
  }
  
  export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    workEmail?: string;
    password: string;
    phoneNumber: string;
    profilePictureUrl?: string;
    preferredLanguage?: string;
    timezone?: string;
    createdAt: string;
    lastLogin?: string;
    role: string;
    status: string;
    idToken?: string;
    refreshToken?: string;
    isEmailVerified: boolean,
    isWorkEmailVerified:boolean
  }
  