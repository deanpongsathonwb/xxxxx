import React, { useMemo } from 'react';
import { Phone, User, Users } from 'lucide-react';
import { uiData } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import { getStudentImageUrl } from '../utils/images';

export const TeacherStudentsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { classes, students } = useApp();

  const teacherClassId = currentUser?.assignedClassId || 'cls-m1-1';
  const assignedClass = classes.find((c) => c.id === teacherClassId);

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === teacherClassId);
  }, [students, teacherClassId]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.navigation.teacherStudents}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {uiData.common.classLabel} {assignedClass?.name}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-lg border border-indigo-200 font-semibold">
          <Users className="w-4 h-4" />
          <span>
            {classStudents.length} {uiData.units.person}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4 w-12 text-center">{uiData.tableHeaders.seatNumber}</th>
              <th className="py-3 px-4 w-20 text-center">{uiData.tableHeaders.studentPhoto}</th>
              <th className="py-3 px-4 w-28">{uiData.tableHeaders.studentId}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.studentName}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.guardianName}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.guardianPhone}</th>
              <th className="py-3 px-4 text-center">{uiData.truancy.accumulatedAbsencesPrefix}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {classStudents.map((student) => {
              const photo = getStudentImageUrl(student.imageKey);
              const isHighAbsence = student.accumulatedAbsences >= 3;

              return (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {student.seatNumber}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <img
                      src={photo}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover mx-auto border border-slate-200"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    {student.studentCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.guardianName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.guardianPhone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isHighAbsence
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {student.accumulatedAbsences} {uiData.units.days}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
