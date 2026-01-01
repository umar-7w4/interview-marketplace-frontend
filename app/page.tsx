"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import Link from "next/link";

function AutoPlayVideo({
  src,
  className,
  ...props
}: {
  src: string;
  className?: string;
  [key: string]: any;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);
  return <video ref={videoRef} src={src} className={className} {...props} />;
}

export function WorkflowSectionSignup() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Choose the Right Role for Signup
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/signupselection.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              Discover how to select the role for signup that best fits your
              career goals by following our step-by-step workflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowSectionLogin() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Choose the Right Role for Login
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              Discover how to select the role for login that best fits your
              career goals by following our step-by-step workflow.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/roleselection.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowSectionDashboardInterviewee() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Access everything on the Interviewee's dashboard
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/dashboard.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              Interviewee Dashboard is a personalized space designed to help
              candidates prepare effectively for their interviews. It allows
              users to view and manage upcoming mock sessions, track feedback
              and performance from industry experts, and access useful prep
              materials and past session recordings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowSectionTranscationsInterviewee() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Check out all the transactions of Interviewee
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              View Transactions provides a clear summary of all your past
              payments and booking details. It allows interviewees to track
              payment status, view receipts, and keep a record of completed
              sessions.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/transcations.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowManageSchedule() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Manage Your Schedule of Interviewee
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/manageschedule.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              Manage Schedule section lets you view, reschedule, or cancel
              upcoming mock interviews. It helps you stay organized and ensures
              your sessions align with your availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowPastSessions() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Review Your Past Sessions
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              Past Sessions section gives you access to your previous mock
              interviews, including expert feedback and session recordings. It’s
              a great way to review performance and track your progress over
              time.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/pastsessions.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowFetchInterviewers() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Fetch available interviewers
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/fetchinterviewers.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              This feature displays a list of available industry experts based
              on your selected role and preferences. You can view their
              experience, specializations, and availability to choose the best
              fit for your mock interview.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowBooking() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Book the mock interview
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              Once you've selected an interviewer, this feature allows you to
              pick a time slot, confirm your booking, and proceed with payment.
              It ensures a smooth and guided process to schedule your mock
              session efficiently.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/bookingvideo.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowFeedbacks() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Give feedback to Interviewer
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/intervieweefeedback.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              This feature allows interviewees to share their experience after
              the mock session by rating the interviewer and providing comments.
              It helps maintain quality and supports continuous improvement for
              future sessions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkDashboardInterviwer() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Access everything on the Interviewer's dashboard
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/interviewerdashboard.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              Interviewer Dashboard is a central hub where experts can manage
              their mock interview sessions. It allows interviewers to view
              upcoming bookings, track their session history, update
              availability, and monitor feedback from interviewees—all in one
              place for a smooth and efficient experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowSectionTranscationsInterviewer() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Check out all the transactions of Interviewer
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              View Transactions provides a clear summary of all your past
              payments and booking details. It allows interviewees to track
              payment status, view receipts, and keep a record of completed.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/transcationsinterviewer.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowAvailability() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Manage Your Availability
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/manageavailabilityinterviewer.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              Manage Availability section allows interviewers to set and update
              their available time slots. This ensures that interviewees can
              book sessions only during times that work best for the
              interviewer, making scheduling efficient and hassle-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowManageScheduleInterviewer() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Manage Your Schedule of Interviewer
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              Manage Schedule section lets you view, reschedule, or cancel
              upcoming mock interviews. It helps you stay organized and ensures
              your sessions align with your availability.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/managescheduleinterviewer.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowFeedbacksInterviewer() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Check feedbacks given by candidates
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/2 ml-24">
            <AutoPlayVideo
              src="/videos/feedbackinterviewer.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 m-24">
            <p className="text-lg md:text-xl">
              This section allows interviewers to view ratings and comments left
              by interviewees after mock sessions. It helps interviewers
              understand their strengths, identify areas for improvement, and
              maintain high-quality interview experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowEditInterviewer() {
  return (
    <section className="w-full bg-gray-900 text-white py-24">
      <div className="w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
          Edit Interviewer's Details
        </h2>
        <div className="flex flex-col md:flex-row items-center mt-24">
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12 ml-24 mr-20">
            <p className="text-lg md:text-xl">
              Interviewer can edit their details such as current company, years
              of experience, skills etc to keep their profiles upto date.
            </p>
          </div>
          <div className="w-full md:w-1/2 ml-24 mr-24">
            <AutoPlayVideo
              src="/videos/editinterviewer.mp4"
              controls
              className="w-full h-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const logoMeshesRef = useRef<THREE.Mesh[]>([]);
  const [workflowChoice, setWorkflowChoice] = useState<
    "none" | "interviewer" | "interviewee"
  >("none");

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 400;
    }
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.4,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 30, 50);
    scene.add(spotLight);

    const logoPaths = [
      "/logos/google.png",
      "/logos/amazon.png",
      "/logos/microsoft.png",
      "/logos/netflix.png",
      "/logos/tesla.png",
      "/logos/adobe.png",
      "/logos/nvidia.png",
      "/logos/paypal.png",
      "/logos/sap.png",
      "/logos/oracle.png",
      "/logos/walmart.png",
      "/logos/samsung.png",
      "/logos/cisco.png",
      "/logos/salesforce.png",
      "/logos/chase.png",
      "/logos/airbnb.png",
      "/logos/tiktok.png",
      "/logos/visa.png",
      "/logos/meta.png",
    ];
    const radius = 27;

    logoPaths.forEach((path, i) => {
      const texture = new THREE.TextureLoader().load(path);
      const geo = new THREE.PlaneGeometry(3, 2);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / logoPaths.length) * Math.PI * 2;
      mesh.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
      mesh.lookAt(camera.position);
      scene.add(mesh);
      logoMeshesRef.current.push(mesh);
    });

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      starField.rotation.y += 0.0007;
      const time = Date.now() * 0.0003;
      logoMeshesRef.current.forEach((mesh, i) => {
        const angleOffset = (i / logoMeshesRef.current.length) * Math.PI * 2;
        mesh.position.x = radius * Math.cos(time + angleOffset);
        mesh.position.z = radius * Math.sin(time + angleOffset);
        mesh.lookAt(camera.position);
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (raf) cancelAnimationFrame(raf);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      logoMeshesRef.current = [];
    };
  }, []);

  return (
    <>
      <main className="relative w-full h-screen overflow-hidden bg-dark text-white">
        <div ref={canvasContainerRef} className="absolute inset-0 z-0 mt-44" />
        <div className="relative z-10 flex flex-col items-center justify-center h-1/2 w-full px-6 mt-10">
          <h1 className="text-4xl md:text-7xl font-bold text-center uppercase tracking-wider mb-6 overflow-hidden whitespace-nowrap typed-text">
            <span
              className="font-extrabold"
              style={{ fontFamily: '"Orbitron", sans-serif' }}
            >
              Welcome to{" "}
            </span>
            <span
              className="font-extrabold"
              style={{ fontFamily: '"Orbitron", sans-serif', color: "#00C6FF" }}
            >
              MockXpert
            </span>
          </h1>
          <p className="text-center text-lg md:text-xl tracking-wide justify-center">
            Elevate your interview skills with live mock sessions from industry
            veterans
          </p>
          <style jsx>{`
            .typed-text {
              animation: typing 3s steps(20, end) forwards,
                blink 0.75s step-end infinite;
              width: 0;
              border-right: 4px solid #fff;
            }
            @keyframes typing {
              from {
                width: 0;
              }
              to {
                width: 26ch;
              }
            }
            @keyframes blink {
              50% {
                border-color: transparent;
              }
            }
          `}</style>
        </div>
        <div className="flex flex-col items-center h-screen mt-64">
          <div className="flex space-x-6 items-center">
            <span className="text-5xl font-bold">Explore</span>
            <Link href="/auth/login?role=interviewer">
              <button className="px-8 py-3 bg-[#00C6FF] text-xl text-white font-bold rounded hover:bg-blue-700 transition">
                for Interviewers
              </button>
            </Link>
            <Link href="/auth/login?role=interviewee">
              <button className="px-8 py-3 bg-green-500 text-xl text-white font-bold rounded hover:bg-green-700 transition">
                for Interviewees
              </button>
            </Link>
          </div>
        </div>
      </main>

      <hr className="border-t border-gray-700" />

      <div className="w-full bg-gray-900 text-white py-16">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Choose which workflows do you want to explore?
        </h2>
        <div className="flex flex-col md:flex-row">
          <div
            onClick={() => setWorkflowChoice("interviewer")}
            className="relative w-full md:w-1/2 flex flex-col items-center justify-center cursor-pointer group py-8"
          >
            <img
              src="/images/interviewer.png"
              alt="Interviewer"
              className="h-64 w-64 rounded-full object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="mt-4 text-2xl font-bold group-hover:underline">
              Interviewer
            </div>
          </div>
          <div
            onClick={() => setWorkflowChoice("interviewee")}
            className="relative w-full md:w-1/2 flex flex-col items-center justify-center cursor-pointer group py-8"
          >
            <img
              src="/images/interviewee.png"
              alt="Interviewee"
              className="h-64 w-64 rounded-full object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="mt-4 text-2xl font-bold group-hover:underline">
              Interviewee
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-700" />
      {workflowChoice === "interviewer" && <WorkflowSectionSignup />}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewer" && <WorkflowSectionLogin />}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      <hr className="border-t border-gray-700" />
      {workflowChoice === "interviewer" && <WorkDashboardInterviwer />}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewer" && <WorkflowAvailability />}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewer" && (
        <WorkflowManageScheduleInterviewer />
      )}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      <hr className="border-t border-gray-700" />
      {workflowChoice === "interviewer" && (
        <WorkflowSectionTranscationsInterviewer />
      )}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      <hr className="border-t border-gray-700" />
      {workflowChoice === "interviewer" && <WorkflowFeedbacksInterviewer />}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewer" && <WorkflowEditInterviewer />}
      {workflowChoice === "interviewer" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowSectionSignup />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowSectionLogin />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && (
        <WorkflowSectionDashboardInterviewee />
      )}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && (
        <WorkflowSectionTranscationsInterviewee />
      )}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowManageSchedule />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowPastSessions />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowFetchInterviewers />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowBooking />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}

      {workflowChoice === "interviewee" && <WorkflowFeedbacks />}
      {workflowChoice === "interviewee" && (
        <hr className="border-t border-gray-700" />
      )}
    </>
  );
}
