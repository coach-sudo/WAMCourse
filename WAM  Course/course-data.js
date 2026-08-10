window.WAM_COURSE = {
  version: '2.0.0',
  title: 'WAM Instructor Lab',
  subtitle: 'A 6-hour active instructor-certification course for teaching the Working Actor Masterclass curriculum from memory',
  totalMinutes: 360,
  defaultLearner: 'Darius A. Journigan',
  levels: [
    {min:0,name:'Observer'}, {min:250,name:'Facilitator'}, {min:600,name:'Coach'},
    {min:1000,name:'Director'}, {min:1500,name:'WAM Instructor'}
  ],
  badges: [
    {id:'first-take',name:'First Take',desc:'Complete your first recorded teach-back.'},
    {id:'instrument',name:'Instrument Online',desc:'Complete Voice & Movement instructor training.'},
    {id:'cartographer',name:'Pressure Cartographer',desc:'Complete the Pressure trilogy training.'},
    {id:'partner',name:'Partner Matters',desc:'Complete Listening & Responding training.'},
    {id:'camera',name:'Camera-Proof',desc:'Complete Acting for the Camera training.'},
    {id:'rehearsal',name:'Rehearsal Captain',desc:'Complete rehearsal and guest-integration training.'},
    {id:'wam-ready',name:'Repeat the Process',desc:'Pass every no-notes workshop certification, finish the course, and score at least 90% on the final exam.'}
  ],
  research: [
    {
      title:'Retrieval practice',
      use:'You repeatedly pull definitions, sequences, prompts, and teaching decisions from memory before seeing the answer.',
      evidence:'Retrieval can produce stronger delayed retention than repeated study, including for meaningful educational material.',
      source:'Roediger & Karpicke (2006), Psychological Science',
      url:'https://doi.org/10.1111/j.1467-9280.2006.01693.x'
    },
    {
      title:'Distributed practice',
      use:'Concepts return later in new contexts instead of being taught once and abandoned.',
      evidence:'A large quantitative review found robust spacing effects across verbal learning studies, with the useful interval depending on the desired retention interval.',
      source:'Cepeda et al. (2006), Psychological Bulletin',
      url:'https://doi.org/10.1037/0033-2909.132.3.354'
    },
    {
      title:'Interleaved retrieval',
      use:'Mastery checks mix workshop purposes, sequences, exercises, and diagnoses instead of letting you stay inside one comfortable topic block.',
      evidence:'A classroom study with secondary-school science students found better delayed performance after interleaved retrieval quizzes than blocked retrieval quizzes.',
      source:'Sana & Yan (2022), Psychological Science',
      url:'https://doi.org/10.1177/09567976211057507'
    },
    {
      title:'Skill retention requires reuse',
      use:'The app includes a post-course Practice Lab because teaching fluency is a procedural skill as well as declarative knowledge; unused skills can decay.',
      evidence:'A 2025 meta-analysis of procedural skill retention found greater performance loss with longer periods of nonuse and identified intermittent performance opportunities as a relevant moderator.',
      source:'Tatel & Ackerman (2025), Psychological Bulletin',
      url:'https://doi.org/10.1037/bul0000481'
    },
    {
      title:'Generation before reveal',
      use:'You predict, classify, teach, or sequence before the app reveals the model.',
      evidence:'Retrieval and attempted generation can strengthen later learning compared with passive restudy.',
      source:'Karpicke & Blunt (2011), Science',
      url:'https://doi.org/10.1126/science.1199327'
    },
    {
      title:'Worked examples + self-explanation',
      use:'You inspect teacher moves, explain why they work, then repair weak versions.',
      evidence:'Worked examples paired with variability and self-explanation can support transferable learning.',
      source:'Renkl et al. (1998), Contemporary Educational Psychology',
      url:'https://doi.org/10.1006/ceps.1997.0959'
    },
    {
      title:'Deliberate practice',
      use:'Teach-backs are short, targeted, repeated, and followed by a narrow rubric instead of vague “practice more.”',
      evidence:'Classic expertise research emphasizes effortful practice aimed at specific weaknesses with informative feedback and repetition.',
      source:'Ericsson, Krampe & Tesch-Römer (1993), Psychological Review',
      url:'https://doi.org/10.1037/0033-295X.100.3.363'
    },
    {
      title:'Retrieval + feedback',
      use:'Knowledge checks immediately explain why an answer works or fails so errors do not become rehearsed.',
      evidence:'Research has found retrieval with feedback can support learning and may also increase willingness to continue studying.',
      source:'Abel & Bäuml (2020), Cognition',
      url:'https://doi.org/10.1016/j.cognition.2020.104316'
    },
    {
      title:'Gamification as support, not pedagogy',
      use:'XP, badges, streaks, challenge rounds, and boss levels reward practice, but mastery still depends on retrieval and rehearsal.',
      evidence:'A meta-analysis found small positive average effects of gamification on cognitive, motivational, and behavioral outcomes, with substantial variation across designs.',
      source:'Sailer & Homner (2020), Educational Psychology Review',
      url:'https://doi.org/10.1007/s10648-019-09498-w'
    }
  ],
  wamSources: [
    {title:'Pressure, Protection, and Access: Understanding How Behavior Emerges in Acting',type:'Pressure Dynamics source',url:'https://drive.google.com/file/d/1652Ag8bhobwupQ2KXN8AjSlhWoix6ak0/view'},
    {title:'TACKL(e): The Five Fields of Pressure Dynamics',type:'Pressure Dynamics source',url:'https://drive.google.com/file/d/1SSB0WF0W0cP130d9WOb8q215QiqLMSYb/view'},
    {title:'The Adaptive Breath Cycle',type:'Pressure Dynamics source',url:'https://drive.google.com/file/d/1wBX0T9AfOtz7XqsAjX-96EZGlVEMpVfH/view'},
    {title:'Receive, Reorganize, Respond',type:'Pressure Dynamics source',url:'https://docs.google.com/document/d/1lBffkGQJC50r8CQShw7nNuXVxHOrwASUV-sf9Qw_NVM/edit'}
  ],
  externalResources: [
    {title:'The Linklater Center',url:'https://www.thelinklatercenter.com/',topic:'Voice & Movement'},
    {title:'The Complete Guide to the Alexander Technique',url:'https://alexandertechnique.com/',topic:'Voice & Movement'},
    {title:'Michael Chekhov Association (MICHA)',url:'https://www.michaelchekhov.org/',topic:'Psychophysical acting'},
    {title:'The Neighborhood Playhouse',url:'https://www.neighborhoodplayhouse.org/',topic:'Meisner / partner work'},
    {title:'NYU Tisch Drama – Meisner training context',url:'https://tisch.nyu.edu/special-programs/high-school-programs/drama',topic:'Meisner / actor training'},
    {title:'SAG-AFTRA Foundation – Performer Programs / On-Camera Labs',url:'https://sagaftra.foundation/our-programs/',topic:'Camera'},
    {title:'SAG-AFTRA Foundation Conversations',url:'https://sagaftra.foundation/conversations/',topic:'Professional craft'}
  ],
  modules: [
    {
      id:'calibration', number:'00', title:'Instructor Calibration', minutes:20,
      objective:'Find what you already know, expose the gaps, and establish a baseline you can compare against six hours from now.',
      activities:[
        {
          id:'cal-cold-teach', type:'record', minutes:3, xp:60, mode:'audio', maxSeconds:75,
          title:'Cold Open: Teach Pressure With No Notes',
          prompt:'Out loud, teach a brand-new WAM actor what “Pressure” means. Explain what changes, what the actor should notice, and what the actor should NOT manufacture. Do not look anything up first.',
          rubric:['Pressure is a meaningful change in conditions, not intensity.','The change matters in relation to pursuit/objective.','Actor receives the change before producing a result.','No prescribed emotion, breath, or visible behavior.']
        },
        {
          id:'cal-how', type:'brief', minutes:3, xp:30,
          title:'How the Lab Works',
          body:[
            'This course is intentionally inconvenient in the useful way. You will be asked to remember before you reread, teach before you feel fully ready, make decisions, say directions out loud, physically run exercises, and repair mistakes.',
            'The six-hour clock measures planned active work, not passive reading. Reference material is available whenever you need it, but the course keeps pushing you back into doing because the job you are preparing for is live facilitation, not recognition on a page.',
            'You are not being trained to recite a script. You are being trained to preserve each lesson’s purpose while adapting language, timing, and correction to the actors actually in front of you.'
          ],
          coachScript:'This course trains performance, not familiarity. You will retrieve, rehearse, teach, diagnose, and try again. When you miss something, treat the miss as information. The goal is not a perfect first answer. The goal is a more available teacher by the end.'
        },
        {
          id:'cal-pretest', type:'quiz', minutes:8, xp:120,
          title:'Baseline Knowledge Check',
          questions:[
            {q:'Which definition best matches Pressure Dynamics?',choices:['Pressure is the actor feeling stressed.','Pressure is conflict or high stakes.','Pressure is a meaningful change in conditions that may require adaptation if pursuit is to continue.','Pressure is any obstacle in the scene.'],answer:2,why:'Pressure is located in changed conditions, not in intensity, emotion, or a generic obstacle.'},
            {q:'A Pressure field is primarily…',choices:['an emotion the actor should play','the dimension of the strategic landscape that changed','the actor’s objective','the tactic used after the change'],answer:1,why:'Time, Access, Control, Knowledge, and Loyalty describe where conditions moved. They do not prescribe behavior.'},
            {q:'Protection is best treated as…',choices:['bad acting that must be removed','proof the actor is emotionally blocked','information about how perceived risk is being managed','the opposite of Access'],answer:2,why:'Protection can narrow, preserve, redirect, or delay Access. Its function matters more than labeling it good or bad.'},
            {q:'What is the safest teaching use of breath in Pressure Dynamics?',choices:['Tell actors to inhale on every discovery.','Use breath change as possible diagnostic evidence that reorganization occurred.','Assign a three-second hold on major beats.','Match each Field to a breath pattern.'],answer:1,why:'The Adaptive Breath Cycle is functional, not choreography. Breath can reveal reorganization but does not prove a Field or emotion.'},
            {q:'Listening & Responding I primarily trains…',choices:['tactics','receiving before responding','camera scale','objective phrasing'],answer:1,why:'Workshop I strips away the urge to prepare a response. Workshop II adds active pursuit and adjustment.'},
            {q:'In Pressure III, what should repeat across takes?',choices:['the exact emotion and rhythm','the exact tactic','conditions, objective, required story/technical structure, and availability','the breath pattern'],answer:2,why:'Repeat the process, not the emotional result.'},
            {q:'When an actor gets a director’s note, the first task is to…',choices:['rebuild the whole scene','perform the note immediately while listening','translate what the note practically changes while keeping the rest of the work intact','ask for a line reading'],answer:2,why:'The WAM camera process trains actors to receive, translate, try, and stay available.'},
            {q:'The strongest WAM correction pattern is usually…',choices:['stack five notes so the actor sees the whole picture','name the desired emotion','make one specific adjustment and rerun enough material to test it','explain the theory until the actor agrees'],answer:2,why:'One adjustment at a time protects embodiment, diagnosis, and useful repetition.'}
          ]
        },
        {
          id:'cal-reflect', type:'reflection', minutes:3, xp:30,
          title:'Your Teaching Risk',
          prompt:'When you care a lot about the work, what do you personally tend to overdo as a teacher: explain too much, rescue too fast, stack notes, demonstrate the result, move too quickly, or something else? Name the behavior, not the personality trait.',
          placeholder:'Example: I keep explaining after the actor already understands the task…'
        },
        {
          id:'cal-contract', type:'checklist', minutes:3, xp:40,
          title:'Instructor Contract',
          items:[
            'I will let an exercise produce information before I explain every concept.',
            'I will correct behavior and task, not diagnose the actor as a person.',
            'I will prefer one useful adjustment over a pile of clever notes.',
            'I will leave room for actor agency, lower-intensity options, and opt-out.',
            'I will repeat structure and purpose without demanding repeated emotional results.'
          ]
        }
      ]
    },
    {
      id:'teaching-engine', number:'01', title:'The WAM Teaching Engine', minutes:30,
      objective:'Learn the repeatable facilitation structure underneath every workshop so you know what to do when the room stops matching the paper.',
      activities:[
        {
          id:'engine-science', type:'brief', minutes:4, xp:40,
          title:'The Science Layer in Plain English',
          body:[
            'You remember teaching material more reliably when you repeatedly retrieve it instead of only rereading it. You get better at a performance skill when practice is specific, effortful, repeated, and paired with usable feedback. You transfer learning better when examples vary and you have to explain why a move works.',
            'That is why this app keeps asking you to close the reference, teach from memory, classify ambiguous examples, and do a second attempt after feedback. The reward system is there to keep momentum. It is not the learning mechanism.',
            'For WAM specifically, this also mirrors the curriculum itself: experience first, notice what changed, name only what helps, then rerun under slightly different conditions.'
          ],
          coachScript:'Your job is not to memorize prettier explanations. Your job is to create conditions where actors can experience the problem, notice what happened, receive a precise frame, and immediately test the frame in action.'
        },
        {
          id:'engine-loop', type:'sort', minutes:5, xp:80,
          title:'Build the Facilitation Loop',
          prompt:'Put the WAM teaching loop in the most useful order.',
          items:['Name the concept only as precisely as needed','Set one clear task','Let the actor do it long enough to create information','Ask what changed / what they noticed','Rerun with one adjustment','Integrate the discovery into the next task'],
          correct:['Set one clear task','Let the actor do it long enough to create information','Ask what changed / what they noticed','Name the concept only as precisely as needed','Rerun with one adjustment','Integrate the discovery into the next task'],
          why:'This keeps explanation downstream of experience and creates an immediate test of whether the language actually changed the work.'
        },
        {
          id:'engine-generate', type:'reveal', minutes:5, xp:50,
          title:'Say the Safeguards Before You See Them',
          prompt:'Without opening Reference, say out loud as many WAM-wide teaching safeguards as you can remember. Aim for at least five.',
          reveal:['Experience before vocabulary.','No forced emotion.','Breath is evidence, not decoration.','Protection is information.','One adjustment at a time.','Do not rehearse the life out of the work.','Separate story pressure from room pressure.','Agency and opt-out.','Reinforce, do not restart.']
        },
        {
          id:'engine-scenarios', type:'quiz', minutes:6, xp:100,
          title:'Teacher Move or Teacher Trap?',
          questions:[
            {q:'An actor rushes a revelation. Best first intervention?',choices:['“Take three seconds before the line.”','“You need to feel the betrayal more.”','Replay the short section and ask what changed before the response became available.','Explain predictive processing for five minutes.'],answer:2,why:'Replay the causal moment. Do not prescribe duration or feeling.'},
            {q:'An actor laughs every time intimacy enters. Best frame?',choices:['“Stop protecting.”','“The laugh is wrong for the scene.”','“What does the laugh make safer, and what does it make harder to access?”','“Play sadness instead.”'],answer:2,why:'Treat Protection as functional information before deciding whether it interferes with pursuit.'},
            {q:'A camera actor misses a mark and also pushes the scene. What first?',choices:['Give mark, eyeline, objective, pace, and emotional notes together.','Choose the condition currently breaking the take, correct one thing, rerun.','Tell them to relax.','Have Bailen fix the acting while you fix the mark.'],answer:1,why:'One adjustment at a time lets you diagnose what actually changes the work.'},
            {q:'A student does not want to participate in an emotionally intense version of an exercise.',choices:['They must do it because the course is an intensive.','Ask them to observe only.','Offer a lower-intensity version that preserves the learning target and allow opt-out.','Tell them the discomfort is the point.'],answer:2,why:'Agency and alternatives are part of the teaching container, not an obstacle to rigor.'}
          ]
        },
        {
          id:'engine-room-language', type:'do', minutes:5, xp:50,
          title:'Turn Theory Into Room Language',
          instructions:[
            'Read each line below OUT LOUD as if six actors were in front of you.',
            'Keep the sentence playable. No mini-lecture after it.',
            'After each line, pause and imagine what you would watch for before giving another note.'
          ],
          prompts:[
            '“Do not show me that it landed. Let it land.”',
            '“What changed?”',
            '“What did that change in what you need?”',
            '“What are you doing now because the old way stopped working?”',
            '“Receive the note. Translate it. Try it. Stay available.”',
            '“Smaller is not less. What stays alive?”'
          ]
        },
        {
          id:'engine-teachback', type:'record', minutes:5, xp:80, mode:'audio', maxSeconds:120,
          title:'Teach the Teaching Engine',
          prompt:'In two minutes, explain how you want WAM actors to learn across the weekend. Include the order of experience, observation, naming, rerun, and integration; explain why you avoid forced emotion and note-stacking.',
          rubric:['Experience comes before vocabulary.','Teacher asks observable/causal questions.','Concept language is concise and functional.','One adjustment gets a real rerun.','Safety/agency remains intact.','The new learning carries into the next workshop rather than resetting.']
        }
      ]
    },
    {
      id:'voice', number:'02', title:'Teach Voice & Movement: Access to the Instrument', minutes:50,
      objective:'Learn the four-day progression and practice leading the exercises as access work, not a generic warm-up routine.',
      activities:[
        {
          id:'voice-arc', type:'sort', minutes:5, xp:70,
          title:'Build the Four-Day Arc',
          prompt:'Put the daily focus in order from Thursday to Sunday.',
          items:['Shared Access – build one company warm-up for filming','Access Under Pressure – recover availability while watched/directed/constrained','Access as Arrival – notice what is already present','Access as Expansion – widen range without forcing'],
          correct:['Access as Arrival – notice what is already present','Access as Expansion – widen range without forcing','Access Under Pressure – recover availability while watched/directed/constrained','Shared Access – build one company warm-up for filming'],
          why:'The arc moves from noticing, to widening, to recovering under demand, to a familiar ensemble warm-up on filming day.'
        },
        {
          id:'voice-thursday-do', type:'guided', minutes:10, xp:110,
          title:'Do Thursday Before You Teach Thursday',
          intro:'Stand up. You are going to run a condensed version of Access as Arrival on yourself. The app can read each phase aloud.',
          phases:[
            {seconds:60,label:'Arrival',script:'Notice feet or chair, temperature, visual field, and natural breath. Fix nothing.'},
            {seconds:75,label:'Baseline scan',script:'Scan jaw, tongue, shoulders, ribs, belly, hips, knees, hands, and feet. Notice effort and ease.'},
            {seconds:90,label:'Mobility',script:'Mobilize head and neck, shoulders, spine, pelvis, knees, ankles, wrists, and hands. Alternate movement with stillness.'},
            {seconds:75,label:'Breath into sound',script:'Use an easy hum, lip vibration, voiced sigh, and open vowel. Let sound ride the breath instead of pushing it.'},
            {seconds:120,label:'Sound + movement',script:'Walk. Change direction, pace, weight, size, and stillness. Add a neutral phrase. Notice what becomes available.'},
            {seconds:60,label:'Protection snapshot',script:'Recall a moment you felt watched, rushed, uncertain, or exposed. Notice the first protective behavior without trying to remove it.'},
            {seconds:45,label:'Close',script:'Say out loud: Right now I have access to… and finish the sentence with one usable resource.'}
          ],
          debrief:['Where did you accidentally start correcting instead of observing?','Which phase most clearly changed available choices?','What wording would keep a student from performing “relaxation”?']
        },
        {
          id:'voice-thursday-teach', type:'record', minutes:5, xp:70, mode:'audio', maxSeconds:120,
          title:'Launch Thursday',
          prompt:'Teach the opening two minutes of Thursday’s Voice & Movement. Set the purpose, give the arrival task, and make it unmistakable that nobody is supposed to “relax” or improve the breath yet.',
          rubric:['Frames access as availability, not perfect relaxation.','Uses observable body/breath/attention instructions.','Explicitly prevents fixing/performing openness.','Language is concise enough that actors can start doing quickly.']
        },
        {
          id:'voice-friday', type:'sort', minutes:7, xp:80,
          title:'Friday: Expansion Without Forcing',
          prompt:'Sequence the major Friday work after the re-arrival.',
          items:['Movement range: stillness to full expression','Resonance and articulation','Vocal range lab','Release pathway','Integration: choose one physical and one vocal access point'],
          correct:['Release pathway','Resonance and articulation','Vocal range lab','Movement range: stillness to full expression','Integration: choose one physical and one vocal access point'],
          why:'Friday progressively frees interference, brings sound into clarity, widens vocal variables, widens physical scale, then asks actors to retain specific resources.'
        },
        {
          id:'voice-saturday-do', type:'guided', minutes:8, xp:90,
          title:'Saturday: Receive Direction Without Seizing Up',
          intro:'Clear a few feet of space. Walk or stand. Let the app act like a demanding room while your job is to stay available.',
          phases:[
            {seconds:35,label:'Baseline',script:'See the room. Feel the floor. Let the breath be ordinary.'},
            {seconds:35,label:'Direction 1',script:'Slower.'},
            {seconds:35,label:'Direction 2',script:'Faster.'},
            {seconds:35,label:'Direction 3',script:'Smaller.'},
            {seconds:35,label:'Direction 4',script:'Turn. Hold. Restart.'},
            {seconds:45,label:'Micro-reset',script:'See the room. Feel the floor. Complete the breath. Release the last round. Find an imagined partner.'},
            {seconds:50,label:'Grounded urgency',script:'Say: I need you to stay. Let the need increase without making the body busier just to prove urgency.'},
            {seconds:45,label:'Scale',script:'Say the same line full-room, conversational, then camera-close. Keep the event and objective unchanged.'}
          ],
          debrief:['Which direction stole the most attention?','What was your actual micro-reset?','Did “smaller” accidentally become less alive?']
        },
        {
          id:'voice-sunday', type:'reveal', minutes:5, xp:55,
          title:'Build Sunday From Memory',
          prompt:'Say the seven phases of the 30-minute filming-day company warm-up in order. Then reveal and compare.',
          reveal:['Arrive and Assess','Ground and Mobilize','Release Unnecessary Effort','Connect Breath, Body, and Sound','Articulation and Resonance','Attention and Responsiveness','Ensemble Synchronization → Camera-Ready Focus']
        },
        {
          id:'voice-troubleshoot', type:'quiz', minutes:5, xp:80,
          title:'Voice & Movement Troubleshooting',
          questions:[
            {q:'An actor is visibly trying to “breathe correctly.” Best cue?',choices:['“Take a deeper breath.”','“Control the inhale.”','“Do not improve it. Observe what it is already doing.”','“Match my breath.”'],answer:2,why:'Baseline awareness precedes correction. The goal is access and information, not an ideal breath.'},
            {q:'Saturday urgency causes rushing. Best correction?',choices:['Slow them down no matter what.','Ask whether urgency can strengthen while feet, articulation, breath, and partner remain available.','Tell them the emotion is too big.','Remove the time need.'],answer:1,why:'The lesson explicitly separates urgency from rushing.'},
            {q:'Camera-close scale looks blank. Best assumption?',choices:['Small acting is always better.','They need larger facial expression.','External economy may have become internal withdrawal; restore objective/event/partner rather than simply enlarging movement.','Tell them to think harder.'],answer:2,why:'Smaller is not less. Scale changes externally while inner/relational life remains fully active.'}
          ]
        },
        {
          id:'voice-final-teach', type:'record', minutes:5, xp:80, mode:'audio', maxSeconds:150,
          title:'Teach the Entire Voice & Movement Throughline',
          prompt:'Without opening the reference, explain the four-day Voice & Movement progression to another teacher. Include what changes each day, what must NOT become ritualized, and why Sunday should feel familiar rather than like a new class.',
          rubric:['Arrival → Expansion → Under Pressure → Shared Access.','Access means usable physical/vocal/relational options, not maximal openness.','Breath/sound/movement are explored without forced results.','Saturday trains recovery under demand.','Sunday recombines familiar tools efficiently for filming.']
        }
      ]
    },
    {
      id:'pressure', number:'03', title:'Teach Pressure in Action I–III', minutes:90,
      objective:'Master the conceptual distinctions, the recurring exercises, and the progression from noticing a shift to pursuing through it to repeating the process under production pressure.',
      activities:[
        {
          id:'pressure-foundation', type:'brief', minutes:8, xp:80,
          title:'The Conceptual Ground You Must Be Able to Defend',
          body:[
            'Pressure is a meaningful change in conditions that alters the landscape around pursuit. It is not stress, conflict, stakes, emotion, or “big acting.” A Field names where that landscape changed: Time, Access, Control, Knowledge, or Loyalty.',
            'Protection describes how perceived risk is managed. Behavioral Access describes the truthful responses currently available inside that organization. Protection and Access are complementary, not opposites. A protection can narrow access, preserve it, redirect it, or delay it.',
            'Receive → Reorganize → Respond is the integrated process. Breath may sometimes expose the transition, but you never assign a dramatic inhale, hold, or exhale to prove a moment. The Adaptive Breath Cycle is a rehearsal lens for causation, not respiratory choreography.',
            'One terminology trap matters: the Access Field is a change in what the character can reach or use in the strategic landscape. Behavioral Access is what responses are currently available to the actor-character. Same word, different level.'
          ],
          coachScript:'Before you teach the trilogy, be able to separate cause from result. Field is not feeling. Pressure is not intensity. Protection is not failure. Access is not vulnerability. Breath is not choreography. Your questions should keep pulling actors back toward what changed, what registered, and what became necessary next.'
        },
        {
          id:'pressure-fields', type:'classify', minutes:12, xp:150,
          title:'TACKL(e) Lightning Round',
          categories:['Time','Access','Control','Knowledge','Loyalty'],
          cases:[
            {text:'The partner says, “My cab is downstairs. I am leaving now.” The immediate problem is that delay has become more expensive.',answer:'Time',why:'The available opportunity to pursue is shrinking.'},
            {text:'The only person who can approve the request stops taking your calls.',answer:'Access',why:'A pathway to what the objective requires has narrowed.'},
            {text:'A junior employee reveals evidence that could end the CEO’s career.',answer:'Control',why:'Formal status may remain, but practical leverage has moved.'},
            {text:'You learn the person you blamed was protecting you the entire time.',answer:'Knowledge',why:'Your operative understanding has changed.'},
            {text:'Your closest ally admits they gave information to the opposition.',answer:'Loyalty',why:'Trust and alliance become unstable.'},
            {text:'A door is locked and the key holder refuses to give it to you.',answer:'Access',why:'The resource/pathway required for pursuit is unavailable.'},
            {text:'The jury returns in five minutes instead of tomorrow.',answer:'Time',why:'The opportunity window compresses.'},
            {text:'The person you believed was powerless reveals they control the money.',answer:'Control',why:'Practical influence over the outcome shifts.'},
            {text:'A partner finally says what they have been hiding for months.',answer:'Knowledge',why:'New information changes the character’s current model.'},
            {text:'A parent says, “If you do this, you are no longer part of this family.”',answer:'Loyalty',why:'Belonging and relational alignment are threatened.'},
            {text:'Your friend is still physically present, but will no longer discuss the subject you need information about.',answer:'Access',why:'Conversational access to the needed route has narrowed.'},
            {text:'A person begins packing while you are still trying to persuade them.',answer:'Time',why:'Their action changes how much opportunity remains.'},
            {text:'You discover the “accident” was planned.',answer:'Knowledge',why:'The meaning of prior facts reorganizes.'},
            {text:'A subordinate now has the only password that can stop the launch.',answer:'Control',why:'Leverage moves despite the hierarchy.'},
            {text:'Your mentor publicly sides with the person attacking you.',answer:'Loyalty',why:'The alliance itself changes.'}
          ]
        },
        {
          id:'pressure-evolving-task', type:'guided', minutes:12, xp:130,
          title:'Run the Evolving Task Laboratory on Yourself',
          intro:'Get three small objects and a chair or surface. You are learning the exercise by feeling what each condition does to organization. The solo version changes rules instead of using a partner.',
          phases:[
            {seconds:50,label:'Round 1: Basic',script:'Move the three objects to the chair in this order: leftmost, rightmost, middle. Notice your baseline.'},
            {seconds:35,label:'Reset',script:'Return to Now. See the room. Feel the floor. Complete the breath. Release the prior round.'},
            {seconds:15,label:'Round 2: Time',script:'Now do the same task in ten seconds. Go.'},
            {seconds:40,label:'Debrief',script:'Say out loud: What changed? What changed in breath, attention, timing, or impulse? What did I do next?'},
            {seconds:55,label:'Round 3: Access',script:'Move one object farther away or behind a simple obstacle. Complete the same task without rushing to beat the inconvenience.'},
            {seconds:40,label:'Debrief',script:'What pathway narrowed? What did your body immediately try to do about it?'},
            {seconds:55,label:'Round 4: Knowledge / Control',script:'Change the required order AFTER you have begun. Use this new order: middle, leftmost, rightmost. Notice the interruption before solving it.'},
            {seconds:50,label:'Protection snapshot',script:'Name the first protective behavior you noticed across the rounds: speed up, brace, smile, freeze, control, over-explain, go vague, or something else.'}
          ],
          debrief:['Which round created the clearest reorganization?','Where did you get ahead of the condition?','How will you stop students from trying to “perform Pressure” once they know the labels?']
        },
        {
          id:'pressure-one-sequence', type:'sort', minutes:8, xp:90,
          title:'Pressure I: Sequence the 90 Minutes',
          prompt:'Order the major blocks.',
          items:['Discover the Protection Pattern','Carry the Process Into the Scene','Establish the Baseline','Name the Five Fields','Frame the Work','Evolving Task Laboratory','Consolidation and Reset'],
          correct:['Frame the Work','Establish the Baseline','Evolving Task Laboratory','Discover the Protection Pattern','Carry the Process Into the Scene','Name the Five Fields','Consolidation and Reset'],
          why:'Actors encounter changing conditions before the Five Fields are revealed. Vocabulary lands on experience instead of replacing it.'
        },
        {
          id:'pressure-protection-access', type:'quiz', minutes:8, xp:120,
          title:'Protection & Access: Stop Making the Easy Mistake',
          questions:[
            {q:'An actor becomes highly polished whenever a close-up begins. What is the most useful first question?',choices:['“Why are you blocked?”','“How do we make you more emotional?”','“What does the polish manage or preserve, and what does it make less available?”','“Can you drop the protection?”'],answer:2,why:'The behavior may manage risk while also narrowing partner access or spontaneity. Function comes first.'},
            {q:'A character jokes while receiving devastating information. Which statement is safest?',choices:['The joke proves the actor did not receive the event.','Humor may be a protective route through which the received truth becomes behavior.','The joke should be removed so grief can appear.','The joke is the Loyalty field.'],answer:1,why:'Protection can carry truth rather than erase it.'},
            {q:'A locked office removes the only place a character can retrieve evidence. This is primarily…',choices:['behavioral Access','the Access Field','Protection','Control'],answer:1,why:'The landscape changed: a needed resource/pathway is unavailable.'},
            {q:'After betrayal, the character can no longer bring themselves to ask directly for comfort, but sarcasm is available. This describes…',choices:['the Access Field','behavioral Access reorganizing','a Time shift','bad acting'],answer:1,why:'The available behavioral pathways have changed inside the current protective organization.'}
          ]
        },
        {
          id:'pressure-objective', type:'reflection', minutes:10, xp:80,
          title:'Pressure II: Objective Lab',
          prompt:'Choose one WAM scene you know. Write an objective using: “I want to ___ you so you will ___.” Then test it against three criteria below. Rewrite until the second half is something the partner can actually DO.',
          placeholder:'I want to ______ you so you will ______.',
          checklist:['The first blank is an action toward the partner, not an emotion.','The second blank is observable enough that the partner could actually do it.','The objective can stay stable while tactics change.']
        },
        {
          id:'pressure-shift-lab', type:'quiz', minutes:10, xp:130,
          title:'Pressure II: When Should the Tactic Change?',
          questions:[
            {q:'Your objective is to get your brother to stay. He laughs at your sincere appeal. Best next instruction?',choices:['“Get angrier.”','“Keep doing sincere appeal because consistency matters.”','“Receive what the laugh changes, keep the objective, and let the next behavior emerge because the old route did not move him.”','“Switch tactics because the script has reached a new beat.”'],answer:2,why:'Tactic change is earned by changed conditions/partner behavior, not by a preplanned beat chart.'},
            {q:'The actor identifies a Pressure shift but immediately changes tactics every time.',choices:['Great; every shift needs a new tactic.','Ask whether the existing tactic became unusable. A real shift may strengthen, alter, or leave the current behavior intact.','Tell them to choose a bigger tactic.','Remove the objective.'],answer:1,why:'A received change does not require visible novelty. Response can include continuation.'},
            {q:'The actor’s first impulse is to joke after a Loyalty rupture, but the joke actually keeps the partner engaged.',choices:['Remove it because it is Protection.','Treat it as potentially functional and test whether it still serves pursuit.','Replace it with vulnerability.','Label it Access and move on.'],answer:1,why:'Protection is not automatically the wrong tactic. Test its function and cost.'},
            {q:'The actor keeps repeating the same demand louder after the partner resists.',choices:['Tell them to push harder.','Ask what new information the resistance gave them and whether their current behavior is changing the partner.','Tell the partner to cooperate.','Add a Time pressure even if none exists.'],answer:1,why:'Workshop II trains adaptation instead of volume escalation.'}
          ]
        },
        {
          id:'pressure-story-room', type:'classify', minutes:8, xp:100,
          title:'Pressure III: Story Pressure or Room Pressure?',
          categories:['Story Pressure','Room Pressure'],
          cases:[
            {text:'The character learns their sister lied.',answer:'Story Pressure',why:'This change belongs to the fictional circumstances and pursuit.'},
            {text:'The camera moves six inches closer for coverage.',answer:'Room Pressure',why:'This is a real production demand on the actor, not a fictional event.'},
            {text:'The partner begins to leave the apartment.',answer:'Story Pressure',why:'The scene conditions change.'},
            {text:'The director asks for less movement.',answer:'Room Pressure',why:'A note/technical constraint belongs to the production room.'},
            {text:'The prop the character needs is taken away by the other character.',answer:'Story Pressure',why:'Access changes inside the scene.'},
            {text:'Crew is waiting and the next take needs to happen quickly.',answer:'Room Pressure',why:'Time pressure exists for the actor but should not automatically become character urgency.'},
            {text:'The actor must hit a precise mark before the next line.',answer:'Room Pressure',why:'Technical continuity/placement is production structure.'},
            {text:'The character realizes this is their final chance to confess.',answer:'Story Pressure',why:'The character’s opportunity window changes.'}
          ]
        },
        {
          id:'pressure-direction', type:'quiz', minutes:6, xp:90,
          title:'Pressure III: Translate the Note',
          questions:[
            {q:'Director says, “Withhold more.” Best actor translation?',choices:['“I should look secretive.”','“I need less emotion.”','“I will preserve the objective and test what becomes riskier to reveal, allowing outward behavior to become more selective.”','“I should pause before every line.”'],answer:2,why:'Translate the note into changed conditions/behavioral task, not a visible result.'},
            {q:'Director says, “Pick up the pace.” Best teaching support?',choices:['“Talk faster.”','“What changes about available time or conversational opportunity while keeping reception intact?”','“Ignore the note; pacing is technical.”','“Remove pauses.”'],answer:1,why:'The note can alter the practical task without erasing partner reception.'},
            {q:'Director says, “Stay closer to the table.”',choices:['Rebuild the whole scene around the table.','Treat it as a physical production condition, keep the objective/story pathway, and rerun.','Make the table emotionally important.','Ask for a new objective.'],answer:1,why:'Technical structure can be repeated while relational behavior remains alive.'}
          ]
        },
        {
          id:'pressure-teachback', type:'record', minutes:8, xp:140, mode:'audio', maxSeconds:300,
          title:'Teach the Trilogy Without the Document',
          prompt:'Give yourself five minutes. Explain Pressure I, II, and III as one investigation. For each workshop: state the central question, the key exercise(s), what is newly added, what remains from the prior workshop, and one common teaching mistake.',
          rubric:['I = feel/notice the shift before terminology.','I includes baseline, evolving task, protection, scene transfer, Fields.','II anchors a relational objective and lets tactics adapt to changed conditions.','III distinguishes story/room Pressure and repeats process under takes/direction/continuity.','Return to Now and the same scene passage create continuity across workshops.','Teacher avoids result notes, forced breath, field over-labeling, and reproduced emotion.']
        }
      ]
    },
    {
      id:'listening', number:'04', title:'Teach Listening & Responding I–II', minutes:45,
      objective:'Train yourself to teach partner-centered receiving first, then active pursuit that remains reorganizable by what the partner actually does.',
      activities:[
        {
          id:'listen-foundation', type:'brief', minutes:4, xp:40,
          title:'The Division of Labor',
          body:[
            'Listening & Responding I removes the pressure to produce a clever response. Its job is Receive → Register → Respond. The actor learns to see actual partner behavior before interpreting it and to let timing, gaze, distance, silence, and action become information.',
            'Listening & Responding II keeps that availability but adds active pursuit: Pursue → Receive → Register → Adjust → Continue. The actor is not waiting passively. They are trying to change the other person and allowing the other person’s response to reorganize how they continue.',
            'The sequence matters. If you teach tactics before the actor can receive, you often get busier predetermined behavior instead of responsiveness.'
          ],
          coachScript:'The partner is not scenery and listening is not polite waiting. In Workshop One, the partner becomes new information. In Workshop Two, that information continuously changes how the actor pursues the objective.'
        },
        {
          id:'listen-observable', type:'classify', minutes:6, xp:80,
          title:'Observable or Interpretation?',
          categories:['Observable','Interpretation'],
          cases:[
            {text:'They looked away for three seconds.',answer:'Observable',why:'A camera or neutral observer could verify it.'},
            {text:'They stopped caring.',answer:'Interpretation',why:'That is a conclusion about meaning or inner state.'},
            {text:'Their answer came more quietly than the prior one.',answer:'Observable',why:'It names a perceivable behavioral change.'},
            {text:'They became ashamed.',answer:'Interpretation',why:'Emotion is inferred.'},
            {text:'They moved the chair farther away.',answer:'Observable',why:'It is a specific action.'},
            {text:'They rejected me.',answer:'Interpretation',why:'That may be a meaningful reading, but first locate the behavior that produced it.'},
            {text:'They smiled after I asked the question.',answer:'Observable',why:'Specific sequence of behavior.'},
            {text:'They were trying to manipulate me.',answer:'Interpretation',why:'Intent is inferred, not directly observed.'}
          ]
        },
        {
          id:'listen-okay', type:'guided', minutes:8, xp:100,
          title:'One-Word “Okay” With the App as Partner',
          intro:'Stand or sit facing an empty chair or the screen. Let each spoken statement arrive. Your only spoken response is “Okay.” Do not design the line. Let silence be allowed.',
          phases:[
            {seconds:20,label:'Settle',script:'See the actual room. Feel the floor. Let your next response be unprepared.'},
            {seconds:22,label:'Prompt 1',script:'I did not tell you because I knew you would try to stop me.'},
            {seconds:28,label:'Prompt 2',script:'I already signed it.'},
            {seconds:18,label:'Prompt 3',script:'You look exhausted.'},
            {seconds:30,label:'Prompt 4',script:'I am not coming tomorrow.'},
            {seconds:20,label:'Prompt 5',script:'I kept the letter.'},
            {seconds:26,label:'Prompt 6',script:'I thought you knew.'},
            {seconds:20,label:'Prompt 7',script:'You can leave if you want.'},
            {seconds:30,label:'Prompt 8',script:'I chose them.'}
          ],
          debrief:['Which “Okay” arrived before you had received the statement?','Which one surprised you in rhythm, breath, or impulse?','Did you start trying to make each response different?']
        },
        {
          id:'listen-change', type:'quiz', minutes:6, xp:90,
          title:'When Do You Call “Change”?',
          questions:[
            {q:'Actor A says the same words but turns away and stops packing. Call “change”?',choices:['No; the text did not change.','Yes; observable behavior changed and may alter the conditions.','Only if Actor B becomes emotional.','Only if the teacher knows what it means.'],answer:1,why:'The exercise trains detection of actual behavioral change, not script landmarks.'},
            {q:'Actor B says “I am fine” and Actor A decides B is lying, but nothing observable changes.',choices:['Call “change.”','Do not call it yet; interpretation alone is not an observable change.','Stop and explain subtext.','Ask B to act more suspicious.'],answer:1,why:'First anchor the exercise in observable difference.'},
            {q:'After a long silence, Actor A takes one step closer.',choices:['Call “change” if the step materially changes the exchange.','Never; movement is not listening.','Only call changes in speech.','Tell them what the step means.'],answer:0,why:'Distance, timing, gaze, breath, and physical behavior can all alter relational conditions.'}
          ]
        },
        {
          id:'listen-many-ways', type:'quiz', minutes:7, xp:100,
          title:'One Want, Many Ways',
          questions:[
            {q:'The actor wants the partner to hand over a phone. Asking gently twice has no effect. Best coaching?',choices:['“Ask harder.”','“What did their refusal tell you? Let that response generate your next attempt while the objective stays the same.”','“Switch objectives.”','“Try anger.”'],answer:1,why:'Tactics emerge from partner response; the objective remains stable enough to organize pursuit.'},
            {q:'A student names tactics before every line.',choices:['Encourage more sophisticated tactic labels.','Have them do the round first, then name behaviors afterward.','Give them a list of tactics to memorize.','Remove the objective.'],answer:1,why:'Workshop II discovers behavior before vocabulary.'},
            {q:'Partner resistance makes the pursuer repeat the same line louder.',choices:['The need is growing, so louder is correct.','Pause and ask what the partner actually did that should change the pursuit.','Tell the resisting actor to help.','Add a camera.'],answer:1,why:'Resistance is new information, not permission to push the same plan.'}
          ]
        },
        {
          id:'listen-silence', type:'guided', minutes:6, xp:80,
          title:'Do Not Fill the Silence',
          intro:'The app will create irregular pauses. Do not talk just because nothing is happening. Let the timing itself become information.',
          phases:[
            {seconds:18,label:'Prompt',script:'Tell me why you came.'},
            {seconds:34,label:'Long delay',script:'I am listening.'},
            {seconds:16,label:'Interruption',script:'No. That is not what I asked.'},
            {seconds:29,label:'Delay',script:'Go on.'},
            {seconds:20,label:'Indirect answer',script:'It has been a long week.'},
            {seconds:32,label:'Silence',script:'What do you need now?'}
          ],
          debrief:['Where did you invent speech to escape the delay?','What did the pause change about Pressure?','How would you teach this without turning silence into a “dramatic pause” trick?']
        },
        {
          id:'listen-teachback', type:'record', minutes:8, xp:120, mode:'audio', maxSeconds:240,
          title:'Teach Both Listening Workshops',
          prompt:'In four minutes, teach another instructor the difference between Listening I and II. Name the major exercises in each, explain why “Okay” comes before tactics, and give two facilitator prompts you would actually use in the room.',
          rubric:['I = Receive → Register → Respond.','I includes See the Person, Okay, Change, Silent Pressure, scene transfer.','II = Pursue → Receive → Register → Adjust → Continue.','II includes working on the other person, one want/many ways, resistance, timing disruption, scene lab.','Tactics are named after behavior, not preselected.','Partner response must be allowed to reorganize pursuit.']
        }
      ]
    },
    {
      id:'camera', number:'05', title:'Teach Acting for the Camera I–II', minutes:50,
      objective:'Learn how to coach availability for the lens, then preserve that life while marks, continuity, coverage, direction, and repetition enter the room.',
      activities:[
        {
          id:'camera-foundation', type:'brief', minutes:5, xp:50,
          title:'What Changes When a Lens Is Present?',
          body:[
            'Camera I is not “do less.” It asks whether the lens can witness thought and reorganization before the actor demonstrates a result. Common protections include presenting, fixing the face, tightening, shrinking everything, anticipating the line, and trying to look natural.',
            'Camera II adds the machinery: marks, frame, eyelines, continuity, reset, coverage, notes, and repeated takes. Technical precision is not the enemy of life; it is the repeatable container inside which the relational event must remain available.',
            'Your division of labor with Bailen is useful: Bailen can clarify what the director/DP needs technically and what the frame reads; you keep connecting those demands back to objective, Pressure, partner, Protection, and availability.'
          ],
          coachScript:'Do not teach smallness as a style. Teach trust. The lens can see the event if the event exists. Then train the actor to obey technical conditions without relocating attention from the story to the machinery.'
        },
        {
          id:'camera-protection', type:'quiz', minutes:5, xp:80,
          title:'Camera Protection or Camera Skill?',
          questions:[
            {q:'Actor barely moves in close-up but is fully receiving and pursuing.',choices:['Protection','Potentially appropriate physical economy','Bad camera acting','Proof the frame is too tight'],answer:1,why:'Stillness can be active. “Small” is not the goal; alive and readable is.'},
            {q:'Actor preps a reaction face before the partner delivers the new information.',choices:['Useful continuity','Presenting / anticipation','Strong eyeline','Active stillness'],answer:1,why:'The visible result arrives before the event.'},
            {q:'Actor hits the mark accurately and immediately reconnects to partner/objective.',choices:['Technical precision supporting storytelling','Over-control','A Control Field shift','Indicating'],answer:0,why:'The point is to make technique inexpensive enough that attention returns to the scene.'}
          ]
        },
        {
          id:'camera-hit-before-line', type:'record', minutes:10, xp:140, mode:'video', maxSeconds:120,
          title:'Camera Lab: Hit Before the Line',
          prompt:'Enable your camera. Frame yourself roughly medium close-up. Press “Read prompt” and let the app give you a piece of information. Receive it, allow whatever reorganization actually occurs, then say only “Okay.” Do 3–5 takes. Watch the final one once with sound and once muted.',
          readerPrompts:['I already told them everything.','I am leaving tonight.','You were right about me.','I found the money.','I never sent the message.'],
          rubric:['The eyes/attention receive the partner before the response is prepared.','There is no added “reaction face” to show meaning.','Silence is allowed if it belongs to the event.','The word emerges after contact rather than from a designed line reading.','External economy does not become inner withdrawal.']
        },
        {
          id:'camera-three-states', type:'do', minutes:6, xp:60,
          title:'Demonstrate the Three States',
          instructions:[
            'Use the same neutral line: “I understand.”',
            'Take 1: deliberately INDICATE the feeling. Make the audience see the result.',
            'Take 2: deliberately SUPPRESS every response. Become externally blank.',
            'Take 3: RECEIVE the imagined event honestly while allowing external behavior to stay economical.',
            'Say out loud what changes between the three. This is the demonstration you may use in Camera I.'
          ]
        },
        {
          id:'camera-workflow', type:'sort', minutes:6, xp:80,
          title:'Camera II: Production Workflow',
          prompt:'Order the typical actor-facing flow Bailen explains.',
          items:['Take','Camera / lighting adjustment','Reset','Rehearsal / blocking','Coverage','Marks','Note'],
          correct:['Rehearsal / blocking','Marks','Camera / lighting adjustment','Take','Reset','Note','Coverage'],
          why:'Specific sets vary, but actors need a plain-language map of why technical steps repeat and change around the scene.'
        },
        {
          id:'camera-continuity', type:'classify', minutes:6, xp:90,
          title:'What Must Match? What Must Stay Alive?',
          categories:['Continuity / Repeatable','Alive / May Vary'],
          cases:[
            {text:'Which hand picks up the glass for the edit point.',answer:'Continuity / Repeatable',why:'Production may need the physical action to match.'},
            {text:'The exact intensity of hurt on Take 3.',answer:'Alive / May Vary',why:'Do not reproduce the emotional result.'},
            {text:'The mark where the actor stops.',answer:'Continuity / Repeatable',why:'Blocking/mark is technical structure.'},
            {text:'The micro-timing of a thought after new partner behavior.',answer:'Alive / May Vary',why:'Response remains relational and present-tense.'},
            {text:'Eyeline required for the coverage.',answer:'Continuity / Repeatable',why:'The frame may require a consistent eyeline.'},
            {text:'Which tactic becomes available after the partner surprises you.',answer:'Alive / May Vary',why:'Tactic remains reorganizable if the partner changes.'},
            {text:'Prop position needed to match the prior angle.',answer:'Continuity / Repeatable',why:'Editorial continuity can require it.'},
            {text:'Exact breath pattern from the take everyone liked.',answer:'Alive / May Vary',why:'Breath is not a continuity target for emotional reproduction.'}
          ]
        },
        {
          id:'camera-adjustment', type:'quiz', minutes:7, xp:100,
          title:'Director’s Adjustment Lab: Coach the Right Problem',
          questions:[
            {q:'Bailen changes eyeline and the actor loses connection to the partner.',choices:['Ignore eyeline.','Keep the technical eyeline, then restore the relational target/objective rather than turning eyeline into the acting task.','Tell them to feel more.','Change the objective.'],answer:1,why:'Technical obedience and relational availability must coexist.'},
            {q:'Actor gets “smaller frame” and begins suppressing all response.',choices:['Good; close-ups require less acting.','Clarify that the frame changes external scale, not the event. Restore receiving and let the lens catch it.','Make them move more.','Remove the note.'],answer:1,why:'Physical economy is not emotional cancellation.'},
            {q:'After a great take, the actor tries to recreate the same tears.',choices:['Encourage it for continuity.','Reset to conditions/objective/pathway and let the next take happen rather than chasing prior feeling.','Tell them exactly when to cry.','Use the prior breath pattern.'],answer:1,why:'Repeat the process, not the result.'},
            {q:'Actor receives two notes: hit a mark and withhold more. Best teaching sequence?',choices:['Give a third note to connect them.','Clarify both quickly, but if the take collapses diagnose one condition at a time and rerun enough to embody it.','Explain all possible meanings of withholding.','Skip rehearsal.'],answer:1,why:'Production can give multiple constraints; your coaching should still avoid indiscriminate note-stacking.'}
          ]
        },
        {
          id:'camera-teachback', type:'record', minutes:5, xp:90, mode:'audio', maxSeconds:180,
          title:'Teach Camera I vs Camera II',
          prompt:'In three minutes: explain what Camera I teaches, what Camera II adds, what Bailen contributes, what you contribute, and the difference between technical continuity and emotional duplication.',
          rubric:['Camera I = lens witnesses thought/reception; not “do less.”','Hit Before the Line and Three States are central experiential tools.','Camera II maps workflow, marks, continuity, direction, repeated takes.','Bailen clarifies director/DP/frame/technical demands.','Darius translates back to partner, objective, Pressure, availability.','Repeat structure, not emotional result.']
        }
      ]
    },
    {
      id:'rehearsal', number:'06', title:'Teach Rehearse Like a Pro + Integrate Guests', minutes:25,
      objective:'Teach actors to use limited rehearsal time intelligently and keep guest workshops distinct while still carrying useful discoveries forward.',
      activities:[
        {
          id:'reh-sequence', type:'sort', minutes:5, xp:70,
          title:'The 30-Minute Rehearsal Class',
          prompt:'Order the blocks.',
          items:['Useful Notes and Actor Language','First Pass: Discover, Don’t Correct','One Variable at a Time','Rehearsal Contract + Handoff','What Rehearsal Is For','Two-Minute Partner Check'],
          correct:['What Rehearsal Is For','First Pass: Discover, Don’t Correct','Two-Minute Partner Check','One Variable at a Time','Useful Notes and Actor Language','Rehearsal Contract + Handoff'],
          why:'Actors first redefine rehearsal, discover before correcting, keep partner talk brief/playable, test one variable, improve note language, then launch directly into work.'
        },
        {
          id:'reh-note-repair', type:'quiz', minutes:6, xp:100,
          title:'Repair the Rehearsal Note',
          questions:[
            {q:'Partner says, “Be angrier here.” Best repair?',choices:['“Okay, I will.”','“Can you tell me what you need from me or what behavior you lost contact with?”','“You be sadder first.”','“Let’s lock the line reading.”'],answer:1,why:'Partners can communicate need, contact, blocking, or practical relationship. They should not prescribe feelings.'},
            {q:'After one run, actor gives partner six notes.',choices:['Useful because rehearsal time is limited.','Name one thing that actually happened and one question; do not fix moments that have happened once.','Write all six into the script.','Let the partner vote.'],answer:1,why:'The first-run rule protects discovery and prevents premature polishing.'},
            {q:'A short section keeps failing because the blocking breaks eye contact.',choices:['Run the whole scene five more times.','Choose that one variable and rerun the small section to test a staging solution.','Ignore blocking.','Direct the partner’s emotional life.'],answer:1,why:'Work in chunks and isolate the actual question.'},
            {q:'The pair gets one great emotional run.',choices:['Repeat until they can reproduce the same feeling.','Retain useful structure/discoveries, but do not rehearse until nothing can surprise them.','Film it immediately and copy it forever.','Add more notes.'],answer:1,why:'Rehearsal repeats process and structure while leaving life available.'}
          ]
        },
        {
          id:'reh-partner-check', type:'reveal', minutes:4, xp:45,
          title:'Two-Minute Partner Check From Memory',
          prompt:'Say the four questions before revealing them.',
          reveal:['What do I want from you?','What is making it hard?','Where does something clearly change?','What practical staging must be agreed?']
        },
        {
          id:'reh-guests', type:'quiz', minutes:5, xp:80,
          title:'Guest Workshop Boundaries',
          questions:[
            {q:'Guest uses terminology that does not match Pressure Dynamics.',choices:['Translate every sentence into WAM language in real time.','Let the guest’s perspective remain distinct; integrate what is useful afterward without forcing equivalence.','Correct the guest publicly.','Cancel the session.'],answer:1,why:'Integration is not assimilation. WAM controls container and carryover, not the guest’s actual pedagogy.'},
            {q:'Guest exercise includes touch or intense personal disclosure.',choices:['Assume consent because actors registered for WAM.','Require explicit opt-in and a clear alternative.','Let the guest decide privately.','Skip explaining the exercise.'],answer:1,why:'Agency and alternatives remain active in guest sessions.'},
            {q:'Pressure III begins soon after Guest #2.',choices:['Use the final guest minutes to introduce as many new terms as possible.','Close by asking what is usable today, then reset the room rather than overloading actors.','Translate the entire guest workshop into the Five Fields.','Extend the guest session indefinitely.'],answer:1,why:'Carry one usable discovery forward and protect cognitive bandwidth.'}
          ]
        },
        {
          id:'reh-teachback', type:'record', minutes:5, xp:80, mode:'audio', maxSeconds:180,
          title:'Launch Rehearse Like a Pro',
          prompt:'Teach the opening three minutes of Rehearse Like a Pro. Explain what rehearsal is for, what it is not for, and give the professional rule about directing your partner. End by launching the first pass.',
          rubric:['Rehearsal investigates circumstances, relationship, objective, shifts, staging, practical problems.','It does not lock line readings or emotional results.','Actors do not direct partner feelings.','First pass runs without unnecessary stopping.','Post-run reflection is one actual event + one question, not a note dump.']
        }
      ]
    },
    {
      id:'practicum', number:'07', title:'Full WAM Instructor Practicum', minutes:50,
      objective:'Retrieve the whole curriculum under pressure, solve realistic teaching problems, teach one workshop cold, and pass a final mastery check.',
      activities:[
        {
          id:'prac-arc', type:'reveal', minutes:5, xp:60,
          title:'The Whole Weekend in One Breath',
          prompt:'Without Reference, explain the WAM throughline from the first Voice & Movement session through filming day. Then reveal the master arc.',
          reveal:['Access the instrument.','Notice meaningful changes in Pressure.','Stay available to partner and circumstances.','Anchor pursuit/objective and adapt behavior as conditions change.','Translate the same responsive process for the camera.','Repeat structure and story truth under technical/room pressure without reproducing emotional results.','Use a familiar company warm-up and filming-day pathway to arrive ready.']
        },
        {
          id:'prac-boss', type:'quiz', minutes:15, xp:220,
          title:'Final Boss: Ten Rooms Go Sideways',
          questions:[
            {q:'Pressure I actors start labeling every line T/A/C/K/L while performing.',choices:['Praise the analysis.','Stop using Fields in performance; return to one lived change, then use the label only afterward if it clarifies the condition.','Add secondary Fields.','Have them speak the Field before each line.'],answer:1,why:'TACKL(e) is primarily a perceptual/preparation/reflection framework, not an internal live checklist.'},
            {q:'Listening I “Okay” becomes eight different performed line readings.',choices:['Ask for more variety.','Shorten rounds and remind them the task is to receive, not design the word.','Move to scene text immediately.','Teach tactics.'],answer:1,why:'The one-word restriction exists to expose receiving, not vocal creativity.'},
            {q:'Pressure II actor’s objective keeps changing whenever emotion changes.',choices:['Good; objectives should follow emotion.','Re-anchor a concrete relational objective and let tactics change around it.','Remove objectives entirely.','Pick an emotion as objective.'],answer:1,why:'Objective provides continuity so adaptation can be observed.'},
            {q:'Camera I actor is small but dead.',choices:['Tell them to be bigger.','Restore the event, partner, and objective; external economy is allowed but inner/relational withdrawal is not the goal.','Tighten the frame.','Ask for tears.'],answer:1,why:'The camera needs access to the event, not a particular movement size.'},
            {q:'Voice Friday actor pushes resonance to “sound good.”',choices:['Increase volume.','Return to easy vibration and clarity; resonance is access, not a produced vocal result.','Skip voice.','Give them a camera note.'],answer:1,why:'Expansion is not forcing.'},
            {q:'Saturday actor gets a technical note and immediately apologizes/explains for a minute.',choices:['Let them finish processing.','Train: receive the note, translate the practical task, try it, then keep/clarify/release.','Give more context.','Tell them not to care.'],answer:1,why:'Camera II rehearses rapid note translation.'},
            {q:'Actor gets emotionally flooded in an exercise and wants a lower-intensity version.',choices:['Intensity proves the work is working.','Preserve the learning target with a lower-intensity option or pause.','Tell them to push through.','Analyze their personal history.'],answer:1,why:'Agency and usable Access matter more than emotional flooding.'},
            {q:'Rehearsal pair keeps restarting the full two-page scene to fix four lines.',choices:['Keep going; full runs build stamina.','Isolate the 4–12 line section and test one variable, then later return to a full run.','Direct the line reading.','End rehearsal.'],answer:1,why:'Efficient rehearsal works in chunks and preserves full runs for integration.'},
            {q:'An actor’s protective humor keeps the partner engaged AND keeps the objective alive.',choices:['Remove it because Protection is bad.','Let it remain unless it stops serving the conditions or narrows something the scene needs.','Call it a Loyalty shift.','Ask for vulnerability instead.'],answer:1,why:'Protection is evaluated by function and cost, not moralized.'},
            {q:'A take works beautifully. Next take the partner genuinely behaves differently.',choices:['Reproduce the prior tactic for continuity.','Repeat circumstances/objective/required continuity and allow the changed partner behavior to reorganize the tactic.','Tell the partner to copy Take 1.','Match the emotional result.'],answer:1,why:'Repeat the process, not the result.'}
          ]
        },
        {
          id:'prac-cold-teach', type:'randomTeach', minutes:10, xp:170,
          title:'Cold Teach: Random Workshop',
          workshops:['Voice Thursday: Access as Arrival','Voice Friday: Access as Expansion','Voice Saturday: Access Under Pressure','Sunday Company Warm-Up','Pressure in Action I','Pressure in Action II','Pressure in Action III','Listening & Responding I','Listening & Responding II','Acting for the Camera I','Acting for the Camera II','Rehearse Like a Pro'],
          prompt:'The app will draw one workshop. Give yourself two minutes to think without opening Reference, then record a five-minute instructor briefing: goal, sequence, key prompts, what you watch for, and how it connects to the surrounding curriculum.',
          rubric:['Central question/purpose is correct.','Major exercise sequence is substantially correct.','Facilitator language is behavioral and concise.','You name at least one likely failure mode and a useful correction.','You connect the workshop to prior/next WAM work.','You preserve agency and avoid forced emotional results.']
        },
        {
          id:'prac-final', type:'quiz', minutes:15, xp:260, final:true,
          title:'Final Mastery Exam',
          questions:[
            {q:'What is the core WAM working loop?',choices:['Feel → Show → Repeat → Polish','Calibrate → Anchor Objective → Notice Pressure → Stay Available → Respond → Reset','Analyze → Choose Emotion → Tactic → Result','Breathe → Pause → Speak → Repeat'],answer:1,why:'This loop organizes the cumulative WAM process.'},
            {q:'What is Return to Now?',choices:['A relaxation ritual','See actual room → feel floor → complete breath → release prior round → find actual partner','Three deep breaths and positive self-talk','A character preparation exercise'],answer:1,why:'It is a practical reset from prior result/room pressure back into present conditions.'},
            {q:'Which Field asks “Who can currently influence the outcome?”',choices:['Time','Access','Control','Loyalty'],answer:2,why:'Control concerns practical leverage/influence.'},
            {q:'Which Field asks “Who or what am I still with?”',choices:['Loyalty','Knowledge','Access','Time'],answer:0,why:'Loyalty concerns alliance, trust, belonging, obligation, or moral alignment.'},
            {q:'Which statement about the Adaptive Breath Cycle is accurate?',choices:['Every major shift should show inhale-hold-exhale.','It is a functional rehearsal framework for Receive-Reorganize-Respond, not a required visible respiratory pattern.','Hold length should match dramatic importance.','It identifies which emotion the actor is feeling.'],answer:1,why:'Breath is observational/diagnostic and variable.'},
            {q:'Why does Pressure I name the Five Fields late?',choices:['To make class mysterious.','So actors have lived examples before receiving taxonomy.','Because Fields are advanced camera terms.','Because they are optional.'],answer:1,why:'Experience before vocabulary.'},
            {q:'Pressure II primarily adds…',choices:['camera continuity','a stable relational objective and adaptive tactics','new breathing rules','guest pedagogy'],answer:1,why:'Workshop II organizes awareness into pursuit.'},
            {q:'Pressure III primarily adds…',choices:['emotional memory','repetition under room/production pressure and direction','voice resonance','new Fields'],answer:1,why:'The process must survive takes, notes, marks, continuity, and observation.'},
            {q:'Listening I’s “Change” exercise should first identify…',choices:['the emotion','observable behavioral change','the correct tactic','the subtext'],answer:1,why:'Observable change precedes interpretation.'},
            {q:'Listening II’s central demand is…',choices:['Wait for the partner.','I am trying to change you, and I remain available to being changed by you.','Never repeat a tactic.','Always speak quickly.'],answer:1,why:'Active pursuit and receptivity coexist.'},
            {q:'Camera I’s principle is closest to…',choices:['The camera needs bigger reactions.','The camera does not need you to show the experience; it needs access to the experience.','Always act smaller.','Ignore the frame.'],answer:1,why:'Camera-readable thought comes from lived reception, not presentation.'},
            {q:'Camera II treats continuity as…',choices:['duplication of feeling','a repeatable technical/story container that supports living behavior','unnecessary for actors','the DP’s problem only'],answer:1,why:'Continuity and present-tense life must coexist.'},
            {q:'A useful partner rehearsal note is…',choices:['“Be angrier.”','“Say the line like this.”','“When you looked away, I started pushing. Can we try keeping more distance here?”','“You should feel betrayed.”'],answer:2,why:'It identifies observable relational/staging information instead of prescribing inner result.'},
            {q:'What should happen after one good first run in rehearsal?',choices:['Fix every weak moment.','Name one thing that actually happened and one question.','Lock line readings.','Repeat until identical.'],answer:1,why:'Do not correct a moment that has only happened once.'},
            {q:'What does “reinforce, do not restart” mean?',choices:['Never review prior work.','Reactivate prior tools briefly and deepen them rather than teaching each class as a separate universe.','Repeat the same lecture every day.','Do not allow new exercises.'],answer:1,why:'WAM is one cumulative curriculum.'},
            {q:'When Protection appears, first ask…',choices:['How do I remove it?','What function/risk-management job is it doing, what does it preserve, and what does it cost?','Which emotion caused it?','Which Field is the actor?'],answer:1,why:'Protection is information.'},
            {q:'Behavioral Access means…',choices:['physical access to a prop','the truthful responses currently available inside the actor-character’s organization','permission to enter a location','the actor being emotionally open'],answer:1,why:'It is the range of usable pathways, not a global trait or the Access Field.'},
            {q:'Best response to note overload?',choices:['Explain more.','Prioritize one adjustment, rerun, observe, then decide what still needs attention.','Ask the actor to remember everything.','Skip repetition.'],answer:1,why:'Narrow feedback allows learning to become embodied and diagnosable.'},
            {q:'Guest workshop integration means…',choices:['Convert the guest’s framework into Pressure Dynamics.','Carry useful discoveries forward while letting the guest perspective remain distinct.','Co-teach every exercise.','Ignore the guest afterward.'],answer:1,why:'WAM owns container and integration, not the guest’s content.'},
            {q:'What is the final filming-day principle?',choices:['Chase the best previous take.','The set can be busy while the scene stays simple.','More pressure means bigger acting.','Technical precision matters more than partner contact.'],answer:1,why:'Actors acknowledge machinery, then return to story, partner, objective, and present-tense response.'}
          ]
        },
        {
          id:'prac-plan', type:'reflection', minutes:5, xp:60,
          title:'Your Final Instructor Card',
          prompt:'Write the five things you most need to remember when you are tired, the schedule is moving, and six actors are looking at you. Make them cues you can actually use in the room.',
          placeholder:'1. Experience before vocabulary…\n2. …\n3. …\n4. …\n5. …'
        }
      ]
    }
  ],
  practiceDrills: [
    {type:'prompt',title:'60-Second Definition',text:'Define Pressure without using the words stress, stakes, conflict, or intensity.'},
    {type:'prompt',title:'Five Fields Sprint',text:'Name all five Fields and give one new example of each.'},
    {type:'prompt',title:'Protection Repair',text:'Explain why “stop protecting” is usually an incomplete acting note and replace it with two better questions.'},
    {type:'prompt',title:'Camera Trust',text:'Teach “the camera sees the thought” without telling the actor to do less.'},
    {type:'prompt',title:'Partner First',text:'Explain the difference between listening and waiting.'},
    {type:'prompt',title:'Room Pressure',text:'Give three examples of room pressure and say how an actor can acknowledge each without feeding it into the character.'},
    {type:'prompt',title:'Rehearsal Rule',text:'Give a partner one useful rehearsal note and one note that crosses the line into directing their result.'},
    {type:'prompt',title:'Voice Arc',text:'Explain why Sunday’s warm-up should not introduce anything new.'},
    {type:'prompt',title:'Objective Test',text:'Create a playable “I want to ___ you so you will ___” objective and explain why the second half is observable.'},
    {type:'prompt',title:'Repeatability',text:'Name what repeats across takes and what must remain alive.'}
  ]
};
