"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  Ban,
  CalendarCheck,
  CheckCircle2,
  FileHeart,
  Heart,
  Home,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import PetCard from "@/components/PetCard";
import { pets } from "@/lib/data";
import { useAccount } from "@/lib/furu-store";
import logo4k from "../../public/images/logo-4k-transparent.png";

const PetScene = dynamic(() => import("@/components/PetScene"), {
  ssr: false,
  loading: () => (
    <Image
      src="/images/furu-hero-pets.png"
      alt="Pets waiting for a caring home"
      fill
      style={{ objectFit: "cover" }}
      priority
    />
  ),
});
const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65 },
};

export default function HomePage() {
  const introRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const account = useAccount();
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: intro } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: story } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const logoScale = useTransform(intro, [0, 0.55, 1], [1, 0.82, 0.5]);
  const logoY = useTransform(intro, [0, 0.6, 1], [0, -35, -145]);
  const logoRotate = useTransform(intro, [0, 1], [0, -16]);
  const logoOpacity = useTransform(intro, [0, 0.72, 1], [1, 1, 0]);
  const sceneRotateY = useTransform(story, [0, 0.5, 1], [-16, 10, -9]);
  const sceneRotateX = useTransform(story, [0, 0.5, 1], [7, -4, 4]);
  const sceneScale = useTransform(story, [0, 0.5, 1], [0.88, 1.05, 0.9]);
  const firstOpacity = useTransform(story, [0, 0.18, 0.31], [1, 1, 0]);
  const secondOpacity = useTransform(story, [0.25, 0.42, 0.63], [0, 1, 0]);
  const thirdOpacity = useTransform(story, [0.58, 0.75, 1], [0, 1, 1]);
  const firstVisibility = useTransform(story, (value) =>
    value > 0.31 ? "hidden" : "visible",
  );
  const secondVisibility = useTransform(story, (value) =>
    value > 0.63 ? "hidden" : "visible",
  );
  return (
    <main className="home-remaster">
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <section className="logo-intro" ref={introRef}>
        <div className="logo-intro-sticky">
          <span className="intro-orb orb-a" />
          <span className="intro-orb orb-b" />
          <motion.div
            className="intro-float-card card-safe"
            style={{
              y: useTransform(intro, [0, 1], [0, -120]),
              rotateY: useTransform(intro, [0, 1], [-12, 18]),
            }}
          >
            <ShieldCheck /> Safe handovers
          </motion.div>
          <motion.div
            className="intro-float-card card-trust"
            style={{
              y: useTransform(intro, [0, 1], [0, -180]),
              rotateY: useTransform(intro, [0, 1], [12, -15]),
            }}
          >
            <Star fill="currentColor" /> Trust Scores
          </motion.div>
          <motion.div
            className="intro-logo-wrap"
            style={{
              scale: logoScale,
              y: logoY,
              rotateX: logoRotate,
              opacity: logoOpacity,
            }}
          >
            <div className="intro-logo">
              <Image
                src={logo4k}
                alt="FurU — a caring home for every pet"
                fill
                priority
                quality={90}
                sizes="(max-width: 700px) 92vw, 720px"
              />
            </div>
            <span className="eyebrow">
              Adopt thoughtfully · Rehome responsibly
            </span>
            <h1>
              A better next chapter
              <br />
              for every pet.
            </h1>
            <p>
              FurU brings pet guardians and adopters together with honest
              profiles, safer decisions, and support that continues after the
              handover.
            </p>
            {account && (
              <div className="hero-actions">
                <Link href="/listings/new" className="btn btn-primary">
                  Rehome a pet <ArrowRight size={18} />
                </Link>
                <Link href="/browse" className="btn btn-ghost">
                  Find a pet
                </Link>
              </div>
            )}
          </motion.div>
          <motion.div
            className="scroll-cue"
            style={{ opacity: useTransform(intro, [0, 0.3], [1, 0]) }}
          >
            <span>Scroll to meet FurU</span>
            <ArrowDown />
          </motion.div>
        </div>
      </section>

      <section className="section home-about">
        <div className="shell">
          <motion.div className="about-lead" {...reveal}>
            <span className="eyebrow">Welcome to FurU</span>
            <h2>
              More than a listing.
              <br />A supported journey home.
            </h2>
            <p>
              FurU is designed for people who need to find a loving next home
              for a pet—and for adopters ready to make a lasting commitment. The
              platform keeps information clear, conversations private, and every
              placement accountable.
            </p>
          </motion.div>
          <div className="benefit-grid">
            {[
              [
                Search,
                "Find the right fit",
                "Search by personality, care needs, location, age, and home compatibility.",
              ],
              [
                FileHeart,
                "Tell the full story",
                "Create an honest pet profile with routines, health details, and the ideal home.",
              ],
              [
                Star,
                "Build trust",
                "See 1–5 star Trust Scores with reviews for accuracy, communication, care, and handover.",
              ],
              [
                MessageCircle,
                "Connect safely",
                "Keep early conversations private and arrange thoughtful meet-and-greets.",
              ],
              [
                UserCheck,
                "Adopt responsibly",
                "One active application at a time prevents rushed or overlapping placements.",
              ],
              [
                CalendarCheck,
                "Stay supported",
                "Follow structured day-2, day-7, day-14, and day-30 monitoring after adoption.",
              ],
            ].map(([Icon, title, copy], i) => (
              <motion.article
                className="benefit-card"
                {...reveal}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                key={String(title)}
              >
                <span>
                  <Icon size={22} />
                </span>
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-story" ref={storyRef}>
        <div className="story-sticky">
          <div className="story-stage">
            <motion.div
              className="story-3d"
              style={{
                rotateY: sceneRotateY,
                rotateX: sceneRotateX,
                scale: sceneScale,
              }}
            >
              <PetScene />
              <span className="story-ring ring-one" />
              <span className="story-ring ring-two" />
            </motion.div>
            <motion.article
              className="story-message message-one"
              style={{ opacity: firstOpacity, visibility: firstVisibility }}
            >
              <span className="story-number">01</span>
              <span className="eyebrow">Start honestly</span>
              <h2>Every detail helps.</h2>
              <p>
                Share the pet’s real personality, health, routines, and needs.
                Honest information creates safer matches.
              </p>
            </motion.article>
            <motion.article
              className="story-message message-two"
              style={{ opacity: secondOpacity, visibility: secondVisibility }}
            >
              <span className="story-number">02</span>
              <span className="eyebrow">Choose carefully</span>
              <h2>Trust has context.</h2>
              <p>
                Profiles, reviews, secure messages, and meet-ups help both
                people decide without pressure.
              </p>
            </motion.article>
            <motion.article
              className="story-message message-three"
              style={{ opacity: thirdOpacity }}
            >
              <span className="story-number">03</span>
              <span className="eyebrow">Follow through</span>
              <h2>Home is a process.</h2>
              <p>
                Monitoring keeps everyone supported while the pet settles into
                their new life.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="section do-section">
        <div className="shell do-layout">
          <motion.div {...reveal}>
            <span className="eyebrow">Responsible by design</span>
            <h2>
              The good things
              <br />
              that pets need.
            </h2>
            <p>
              A successful adoption begins before the first meeting. FurU makes
              responsible actions visible and easy to follow.
            </p>
            <Link href="/resources" className="btn btn-dark">
              Explore pet-care resources <ArrowRight size={17} />
            </Link>
          </motion.div>
          <div className="do-list">
            {[
              [
                CheckCircle2,
                "Do share complete records",
                "Vaccines, medication, behavior, and daily care should be clear from the start.",
              ],
              [
                CheckCircle2,
                "Do meet in a safe place",
                "Choose a calm, appropriate setting and give the pet time to respond naturally.",
              ],
              [
                CheckCircle2,
                "Do prepare the household",
                "Confirm housing rules, family agreement, budget, supplies, and veterinary plans.",
              ],
              [
                CheckCircle2,
                "Do give adjustment time",
                "New pets need routine, patience, quiet space, and realistic expectations.",
              ],
              [
                Ban,
                "Never sell through adoption",
                "FurU is for responsible rehoming—not breeding, hidden fees, or pet sales.",
              ],
            ].map(([Icon, title, copy], i) => (
              <motion.div
                className="do-item"
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                key={String(title)}
              >
                <span>
                  <Icon />
                </span>
                <div>
                  <h3>{String(title)}</h3>
                  <p>{String(copy)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section journey-section">
        <div className="shell">
          <motion.div className="section-head" {...reveal}>
            <div>
              <span className="eyebrow">Choose your path</span>
              <h2>FurU is here for both sides.</h2>
            </div>
            <p>
              Whether you need to find a new guardian or hope to welcome a pet,
              you get the same calm, welfare-first tools.
            </p>
          </motion.div>
          <div className="journeys">
            <motion.article className="journey rehome" {...reveal}>
              <span className="journey-orb" />
              <div>
                <span className="eyebrow">For current guardians</span>
                <h2>Rehome with care</h2>
                <ul>
                  <li>Publish a complete pet profile</li>
                  <li>Review thoughtful applicants</li>
                  <li>Support a safe handover</li>
                </ul>
              </div>
              {account && (
                <Link href="/listings/new" className="btn btn-dark">
                  Create a pet profile <ArrowRight size={17} />
                </Link>
              )}
            </motion.article>
            <motion.article
              className="journey adopt"
              {...reveal}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <span className="journey-orb" />
              <div>
                <span className="eyebrow">For future guardians</span>
                <h2>Adopt thoughtfully</h2>
                <ul>
                  <li>Discover compatible pets</li>
                  <li>See guardian Trust Scores</li>
                  <li>Apply one pet at a time</li>
                </ul>
              </div>
              {account && (
                <Link href="/browse" className="btn btn-dark">
                  Meet the pets <ArrowRight size={17} />
                </Link>
              )}
            </motion.article>
          </div>
        </div>
      </section>

      {account && (
        <section className="section featured-home">
        <div className="shell">
          <motion.div className="section-head" {...reveal}>
            <div>
              <span className="eyebrow">Waiting to meet you</span>
              <h2>New friends, real needs.</h2>
            </div>
            <Link href="/browse" className="btn btn-ghost">
              Browse all pets <ArrowRight size={17} />
            </Link>
          </motion.div>
          <div className="cards">
            {pets.slice(0, 3).map((pet, i) => (
              <motion.div
                key={pet.id}
                {...reveal}
                transition={{ delay: i * 0.08 }}
              >
                <PetCard pet={pet} />
              </motion.div>
            ))}
          </div>
        </div>
        </section>
      )}

      {!account && (
        <section className="shell home-final">
        <motion.div {...reveal}>
          <Sparkles />
          <span className="eyebrow">A safer second chance</span>
          <h2>Ready to make a good next step?</h2>
          <p>
            Create your account, tell the truth, take your time, and put the
            pet’s long-term wellbeing first.
          </p>
          <div className="hero-actions">
            <Link href="/sign-up" className="btn">
              Create an account <ArrowRight size={17} />
            </Link>
            <Link href="/download" className="btn btn-outline-light">
              Download FurU
            </Link>
          </div>
        </motion.div>
        <div className="final-home-mark">
          <Home />
          <Heart fill="currentColor" />
        </div>
        </section>
      )}
    </main>
  );
}
