export interface Skill {
    skillId: number;
    name: string;
    description?: string;
  }

  export interface IntervieweeSkillDto {
    intervieweeSkillId?: number;     
    intervieweeId: number;       
    skillId: number;               
    yearsOfExperience: number;
    proficiencyLevel: string;     
    certified: boolean;
  }
  
  export interface IntervieweeDto {
    intervieweeId: number;
    userId: number;
    educationLevel?: string;
    languagesSpoken?: string[];
    currentRole?: string;
    fieldOfInterest?: string;
    resume?: string;
    linkedinUrl:string;
    profileImage:string;
    timezone: string;
    skills: {
      skillId: number;
      yearsOfExperience: number;
      proficiencyLevel: "Beginner" | "Intermediate" | "Advanced";
      certified: boolean;
    }[];
  }
  
  export interface InterviewerSkillDto {
    interviewerSkillId?: number;
    interviewerId: number;
    skillId: number;
    yearsOfExperience: number;
    proficiencyLevel: string;     
    certified: boolean;
  }
  
  export interface InterviewerDto {
    interviewerId?: number;
    userId: number;
    bio?: string;
    currentCompany?: string;
    yearsOfExperience: number;
    languagesSpoken?: string[];
    certifications: string[];
    sessionRate: number;
    timezone: string;
    profileCompletionStatus:boolean;
    status:string;
    skills: {
      skillId: number;
      yearsOfExperience: number;
      proficiencyLevel:string;
      certified: boolean;
    }[];
    isVerified: boolean; 
    averageRating: number;
    linkedinUrl:string;
    profileImage:string;
  }

  export interface Availability {
    availabilityId: number;
    interviewerId: number;
    date: string; 
    startTime: string; 
    endTime: string; 
    status: string;
    timezone: string;
  } 

  export interface Booking {
    bookingId: number;
    intervieweeId: number;
    availabilityId: number;
    bookingDate: string;
    totalPrice: number;
    paymentStatus: string;
    cancellationReason?: string;
    notes?: string;
  }
  
  export interface Feedback {
    feedbackId?: number;
    createdAt?: string;
    interviewId: number;
    giverId: number;
    receiverId: number;
    rating: number;
    comments: string;
    positives: string;
    negatives: string;
    improvements: string;
  }

  export interface Interview {
    interviewId: number;
    intervieweeId: number;
    interviewerId: number;
    bookingId: number;
    date: string;
    startTime: string; 
    duration: number; 
    interviewLink: string;
    status: string;
    endTime?: string;
    timezone: string;
    actualStartTime?: string;
    actualEndTime?: string;
    title:string
  }
  
  
  export interface InterviewerVerification {
    interviewerVerificationId: number;
    verificationToken: string;
    status: string;
    verificationNotes?: string;
    lastUpdated: string;
    interviewerId: number;
    tokenExpiry?: string;
  }

  export interface Notification {
    notificationId: number;
    userId: number;
    type: "EMAIL";
    subject: string;
    message: string;
    status:string;
    sentAt?: string;
    readAt?: string;
    bookingId?: number;
    interviewId?: number;
    paymentId?: number;
    feedbackId?: number;
    scheduledSendTime?: string;
    isRead: boolean;
    timeBeforeInterview?: number; 
  }
  
  
  export interface Payment {
    paymentId: number;
    bookingId: number;
    transactionId: string;
    paymentDate: string;
    amount: number;
    currency: string; 
    paymentMethod: string;
    receiptUrl?: string;
    refundAmount?: number;
    paymentStatus: string;
    interviewId?: number;
  }
  
export interface IAvailability {
  availabilityId: number;
  interviewerId: number;   
  date: string;      
  startTime: string;      
  endTime: string;  
  status: "AVAILABLE" | "BOOKED" | "EXPIRED";
  timezone: string;
}
