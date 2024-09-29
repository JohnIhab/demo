"use strict";
/*model User {
id                         Int        @id @default(autoincrement())
firstName                  String
lastName                   String
email                      String     @unique
googleId                   String?    @unique
password                   String
schooleYear                String?
mobileNumber               String     @unique
role                       String     @default("USER")
avatar                     String?
cart                       Cart?
verificationCode           Int?
emailverified              Boolean    @default(false)
verificationToken          String?    // Field for storing the verification token
verificationTokenExpiresAt DateTime?  // Field for storing the token expiration
lastLogout                 DateTime?
isResetCodeVerified        Boolean    @default(false)
createdAt                  DateTime   @default(now())
updatedAt                  DateTime   @updatedAt
User_Codes                 User_Codes?
Contact_Us                 Contact_Us[]
}

model User_Codes {
id                         Int        @id @default(autoincrement())
verifyEmailCode            String?
verifyEmailCodeExpiresAt   DateTime?
resetPasswordCode          String?
resetPasswordCodeExpiresAt DateTime?
resetPasswordCodeVerified  Boolean    @default(false)
userId                     Int        @unique
User                       User       @relation(fields: [userId], references: [id])
}

model Contact_Us {
id        Int      @id @default(autoincrement())
subject   String
message   String
createdAt DateTime @default(now())
userId    Int
user      User     @relation(fields: [userId], references: [id])
}



model Cart {
id         Int         @id @default(autoincrement())
user       User        @relation(fields: [userId], references: [id])
userId     Int         @unique
items      CartItem[]
createdAt  DateTime    @default(now())
updatedAt  DateTime    @updatedAt
}

model CartItem {
id            Int      @id @default(autoincrement())
cart          Cart     @relation(fields: [cartId], references: [id])
cartId        Int
lectureId Int
lecture   Lecture  @relation(fields: [lectureId], references: [id])
quantity      Int      @default(1)
createdAt     DateTime @default(now())
updatedAt     DateTime @updatedAt
purchaseDate  DateTime? // Date when the video was purchased
expiryDate    DateTime? // Date when the video access expires
purchased     Boolean   @default(false) // Indicates if the item is purchased
@@unique([cartId, videoId])
}


model Course {
id            Int       @id @default(autoincrement())
name          String
description   String?
level         String     // 'ثانوي عام' or 'ثانوي لغات'
imageUrl      String?
terms         Term[]
createdAt     DateTime   @default(now())
updatedAt     DateTime   @updatedAt
}

model Term {
id            Int       @id @default(autoincrement())
name          String     // 'الترم الاول' or 'الترم الثاني'
courseId      Int
course        Course     @relation(fields: [courseId], references: [id])
content       Content[]
}

model Content {
id            Int       @id @default(autoincrement())
type          String    // 'شرح محاضرات', 'حل امتحانات', 'Quiz'
videoUrl      String?   // URL for lecture videos
pdfs          PDF[]     // Relationship to PDF
quizzes       Quiz[]    // Relationship to Quiz
termId        Int
term          Term      @relation(fields: [termId], references: [id])
}

model Lecture {
id             Int       @id @default(autoincrement())
name           String
numberOfLectures Int
price          Float?
photoUrl       String?
courseId       Int
course         Course    @relation(fields: [courseId], references: [id])
videos         Video[]
createdAt      DateTime  @default(now())
updatedAt      DateTime  @updatedAt
cartItems CartItem[]
}
model Video {
  id         Int      @id @default(autoincrement())
  url        String
  lecture    Lecture  @relation("LectureVideos", fields: [lectureId], references: [id])
  lectureId  Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
model PDF {
id        Int       @id @default(autoincrement())
link      String    // URL for the PDF
imageUrl  String?   // URL for the image associated with the PDF
contentId Int
content   Content   @relation(fields: [contentId], references: [id])
createdAt DateTime  @default(now())
updatedAt DateTime  @updatedAt
}

model Quiz {
id        Int      @id @default(autoincrement())
link      String   // URL for the Quiz
imageUrl  String?  // URL for the image associated with the Quiz (if applicable)
contentId Int
content   Content @relation(fields: [contentId], references: [id])
}
  */ 
//# sourceMappingURL=prisma.js.map