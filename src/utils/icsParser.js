import ICAL from 'ical.js';
import * as FileSystem from 'expo-file-system';
import db from '../database/database';

export const parseICSFile = async (fileUri) => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const jcalData = ICAL.parse(fileContent);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const scheduleItems = [];

    vevents.forEach(vevent => {
      const event = new ICAL.Event(vevent);
      const rrule = event.component.getFirstPropertyValue('rrule');

      if (rrule) {
        const dayMap = {
          'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6, 'SU': 0
        };

        const days = rrule.parts.BYDAY || [];
        days.forEach(day => {
          scheduleItems.push({
            course_code: event.summary.split(' ')[0] || 'COURSE',
            course_name: event.summary,
            location: event.location || 'TBA',
            day_of_week: dayMap[day] || 0,
            start_time: event.startDate.toString(),
            end_time: event.endDate.toString(),
            instructor: event.organizer || 'TBA'
          });
        });
      }
    });

    return scheduleItems;
  } catch (error) {
    console.error('ICS parsing error:', error);
    throw error;
  }
};

export const importSchedule = (scheduleItems) => {
  try {
    scheduleItems.forEach(item => {
      db.runSync(
        `INSERT INTO schedule (course_code, course_name, instructor, location, day_of_week, start_time, end_time)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [item.course_code, item.course_name, item.instructor, item.location,
         item.day_of_week, item.start_time, item.end_time]
      );
    });
    return true;
  } catch (error) {
    console.error('Import schedule error:', error);
    throw error;
  }
};
