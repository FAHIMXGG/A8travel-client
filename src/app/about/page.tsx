"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Facebook, Twitter, Linkedin, Github, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500" />
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white/10 backdrop-blur-xl bg-white/5">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      alt="Ahasanul Haque"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold  e">Hi, I'm Ahasanul Haque</h1>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                    Frontend Developer
                  </h2>
                </div>

                <p className="text-sm sm:text-base  e/80 leading-relaxed">
                  Hello, I am Ahasanul Haque. I love Programming, making web Application. I started programming as a
                  hobby since 2017. Wrote my first program by using PHP. Later I learned JavaScript, Worked in several
                  libraries & frameworks like ReactJS, NextJS, worked using several technologies like Git. It does feel
                  amazing to see myself improving. Hope to improve everything around me one day
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <a
                    href="https://drive.google.com/file/d/165onGPsFU5wvf6-ikHlycGol8H7V51Vn/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700  e font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                      View Resume
                    </Button>
                  </a>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700  e font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-amber-500/50 transition-all duration-300">
                        More About Me
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950/95 backdrop-blur-xl border-white/10  e max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                          Hello there! 👋🏼
                        </DialogTitle>
                        <DialogDescription className=" e/70 space-y-4 text-sm sm:text-base leading-relaxed mt-4">
                          <p>
                            My name is Ahasanul Haque, and I am a dedicated MERN stack developer with valuable recent
                            experience in WordPress. Programming and web development have been my passions since 2017,
                            and I've been on an incredible journey of growth ever since.
                          </p>
                          <p>
                            I possess a strong foundation in web development, starting with PHP and expanding my
                            knowledge to JavaScript. Along the way, I have worked extensively with various libraries and
                            frameworks, including ReactJS and NextJS. These tools have empowered me to create dynamic
                            and engaging web applications that provide exceptional user experiences.
                          </p>
                          <p>
                            My recent focus has been on WordPress, where I have gained valuable expertise. I take pride
                            in my ability to develop custom themes, plugins, and websites tailored to meet the unique
                            needs of clients. Understanding the architecture and ecosystem of WordPress allows me to
                            optimize performance, enhance security, and ensure seamless functionality for users.
                          </p>
                          <p>
                            In addition to my technical skills, I am well-versed in utilizing version control systems
                            like Git, enabling efficient collaboration and maintaining code integrity throughout
                            development cycles. I am constantly learning and staying updated with the latest industry
                            trends and best practices, as I believe continuous improvement is essential in this
                            ever-evolving field.
                          </p>
                          <p>
                            As a developer, I am known for my strong problem-solving abilities and a commitment to
                            delivering high-quality solutions. I thrive in team environments, collaborating with others
                            to achieve shared goals and create exceptional digital experiences. My versatility in
                            seamlessly integrating the MERN stack with my WordPress expertise makes me a valuable asset
                            to any development team.
                          </p>
                          <p>
                            With a genuine passion for programming and a relentless drive for excellence, I am
                            determined to contribute to the success of future web projects and push the boundaries of
                            innovation in web development. I am excited about the endless possibilities this field
                            offers and look forward to making a positive impact through my work.
                          </p>
                          <p>
                            Thank you for taking the time to learn a little bit about me. I am eager to embark on new
                            challenges and bring my skills and enthusiasm to your next project.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex gap-3 sm:gap-4 justify-center lg:justify-start flex-wrap">
                  <a
                    href="https://www.facebook.com/FAHIMX007/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="p-2.5 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                      <Facebook className="w-5 h-5 sm:w-6 sm:h-6  e group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </a>
                  <a href="https://twitter.com/fahim2259" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="p-2.5 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                      <Twitter className="w-5 h-5 sm:w-6 sm:h-6  e group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/fahimx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="p-2.5 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                      <Linkedin className="w-5 h-5 sm:w-6 sm:h-6  e group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </a>
                  <a href="https://github.com/FAHIMXGG" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="p-2.5 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                      <Github className="w-5 h-5 sm:w-6 sm:h-6  e group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </a>
                  <a
                    href="https://discord.com/users/405654158901903361"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="p-2.5 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6  e group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </a>
                  <a href="https://wa.link/a8gcn6" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="p-2.5 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6  e group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
