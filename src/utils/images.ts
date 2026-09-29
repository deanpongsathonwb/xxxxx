import imagesData from '../seed/images.json';

export function getUserImageUrl(key: string): string {
  const users = imagesData.users as Record<string, string>;
  return users[key] || imagesData.students.defaultAvatar;
}

export function getStudentImageUrl(key: string): string {
  const students = imagesData.students as Record<string, string>;
  return students[key] || imagesData.students.defaultAvatar;
}
