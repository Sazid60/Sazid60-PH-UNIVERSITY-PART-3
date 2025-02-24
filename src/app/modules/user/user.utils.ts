// auto generate id

import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  // here lean mean it will give pure javascript which will make faster. but we can not use it all time time, when we are using query and doing no other mongoose operation we can use lean()

  //   2030 01 (0001) this will be incremented
  return lastStudent?.id ? lastStudent.id : undefined;
  //   substring(6) means it will cut down 6 digits
};

// -->year->semester->4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString(); // by default it would be 0000

  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); //00001
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
