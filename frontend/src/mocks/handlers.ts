import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

// In-memory data store for the session
const generateCourses = (count = 10) => {
  return Array.from({ length: count }).map(() => ({
    _id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs(2),
    createdBy: {
      _id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar()
    },
    price: faker.number.int({ min: 0, max: 5000 }),
    category: faker.helpers.arrayElement(['Development', 'Business', 'Design', 'Marketing']),
    modules: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }).map((_, i) => ({
      title: faker.lorem.sentence(4),
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: faker.number.int({ min: 5, max: 60 })
    })),
    thumbnail: faker.image.urlLoremFlickr({ category: 'education' }),
    isPublished: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString()
  }));
};

let courses = generateCourses(20);
let enrollments: any[] = [];

// Base URL matcher
const apiUrl = (path: string) => `http://localhost:5000/api${path}`;

const createSuccess = (data: any, message = 'Success') => ({
  success: true,
  message,
  data
});

export const handlers = [
  // --- AUTH ---
  http.post(apiUrl('/auth/login'), async ({ request }) => {
    const body = (await request.json()) as any;
    const user = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: body.email,
      role: body.email.includes('admin') ? 'admin' : (body.email.includes('instructor') ? 'instructor' : 'student'),
      avatar: faker.image.avatar()
    };
    return HttpResponse.json(createSuccess({ token: 'mock-jwt-token', user }));
  }),

  http.post(apiUrl('/auth/register'), async ({ request }) => {
    const body = (await request.json()) as any;
    const user = {
      id: faker.string.uuid(),
      name: body.name,
      email: body.email,
      role: body.role || 'student',
      avatar: faker.image.avatar()
    };
    return HttpResponse.json(createSuccess({ token: 'mock-jwt-token', user }));
  }),

  http.put(apiUrl('/auth/profile'), async ({ request }) => {
    const body = (await request.json()) as any;
    const user = {
      id: faker.string.uuid(),
      name: body.name,
      email: body.email || faker.internet.email(),
      role: 'student',
      avatar: body.avatar || faker.image.avatar(),
      bio: body.bio
    };
    return HttpResponse.json(createSuccess({ token: 'mock-jwt-token-updated', user }));
  }),

  // --- COURSES ---
  http.get(apiUrl('/courses/'), () => {
    const published = courses.filter(c => c.isPublished);
    return HttpResponse.json(createSuccess(published));
  }),

  http.get(apiUrl('/courses/my'), () => {
    // Return a subset of courses as the instructor's courses
    return HttpResponse.json(createSuccess(courses.slice(0, 5)));
  }),

  http.get(apiUrl('/courses/:id'), ({ params }) => {
    const course = courses.find(c => c._id === params['id']) || courses[0];
    return HttpResponse.json(createSuccess(course));
  }),

  http.post(apiUrl('/courses'), async ({ request }) => {
    const body = (await request.json()) as any;
    const newCourse = {
      _id: faker.string.uuid(),
      title: body.title,
      description: body.description,
      createdBy: { _id: faker.string.uuid(), name: 'Mock Instructor', avatar: faker.image.avatar() },
      price: body.price,
      category: body.category,
      modules: body.modules || [],
      thumbnail: body.thumbnail || faker.image.urlLoremFlickr({ category: 'education' }),
      isPublished: false,
      createdAt: new Date().toISOString()
    };
    courses = [newCourse, ...courses];
    return HttpResponse.json(createSuccess(newCourse));
  }),

  http.put(apiUrl('/courses/:id'), async ({ request, params }) => {
    const body = (await request.json()) as any;
    const index = courses.findIndex(c => c._id === params['id']);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...body };
      return HttpResponse.json(createSuccess(courses[index]));
    }
    return HttpResponse.json(createSuccess(courses[0]));
  }),

  http.delete(apiUrl('/courses/:id'), ({ params }) => {
    courses = courses.filter(c => c._id !== params['id']);
    return HttpResponse.json(createSuccess(null, 'Course deleted'));
  }),

  // --- ENROLLMENTS ---
  http.get(apiUrl('/enrollments/me'), () => {
    return HttpResponse.json(createSuccess(enrollments));
  }),

  http.post(apiUrl('/enrollments/enroll'), async ({ request }) => {
    const body = (await request.json()) as any;
    const course = courses.find(c => c._id === body.courseId) || courses[0];
    
    const enrollment = {
      _id: faker.string.uuid(),
      student: 'mock-student-id',
      course,
      progress: course.modules.map((m, i) => ({ moduleIndex: i, completed: false })),
      enrolledAt: new Date().toISOString(),
      status: 'active'
    };
    
    enrollments = [enrollment, ...enrollments];
    return HttpResponse.json(createSuccess(enrollment));
  }),

  http.put(apiUrl('/enrollments/:id/progress'), async ({ request, params }) => {
    const body = (await request.json()) as any;
    const { moduleIndex, completed } = body;
    
    const eIndex = enrollments.findIndex(e => e._id === params['id']);
    if (eIndex !== -1) {
      const pIndex = enrollments[eIndex].progress.findIndex((p: any) => p.moduleIndex === moduleIndex);
      if (pIndex !== -1) {
        enrollments[eIndex].progress[pIndex].completed = completed;
      }
      return HttpResponse.json(createSuccess(enrollments[eIndex]));
    }
    return HttpResponse.json(createSuccess(null));
  })
];
