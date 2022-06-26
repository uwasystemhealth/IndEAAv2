from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from course_evaluations.models import EOCGeneral, EOCSet, EOCSpecific

# List of groups and permission for each group
GROUPS = []

# [username, email, password, group, is_staff]
USERS = [
    ["test1", "test@systemhealthlab.com", "test1", None, True],
]


def add_default_eoc_set():
    # Create if one does not exist
    base_eoc_set, created = EOCSet.objects.get_or_create(name="IAP Mechanical")

    if created:
        BASE_EOC = [
            {
                "eocGeneral": 1,
                "title": "Knowledge and Skill Base",
                "eocSpecifics": [
                    {
                        "eocSpecific": 1,
                        "description": (
                            "Comprehensive, theory based understanding of the underpinning natural and physical sciences and the engineering"
                            " fundamentals applicable to the engineering discipline."
                        ),
                        "indicatorsOfAttainment": [
                            "Engages with the engineering discipline at a phenomenological level, applying sciences and engineering fundamentals to"
                            " systematic investigation, interpretation, analysis and innovative solution of complex problems and broader aspects of"
                            " engineering practice."
                        ],
                    },
                    {
                        "eocSpecific": 2,
                        "description": (
                            "Conceptual understanding of the mathematics, numerical analysis, statistics, and computer and information sciences which"
                            " underpin the engineering discipline"
                        ),
                        "indicatorsOfAttainment": [
                            "Develops and fluently applies relevant investigation analysis, interpretation, assessment, characterisation, prediction,"
                            " evaluation, modelling, decision making, measurement, evaluation, knowledge management and communication tools and"
                            " techniques pertinent to the engineering discipline."
                        ],
                    },
                    {
                        "eocSpecific": 3,
                        "description": "In-depth understanding of specialist bodies of knowledge within the engineering discipline.",
                        "indicatorsOfAttainment": [
                            "Proficiently applies advanced technical knowledge and skills in at least one specialist practice domain of the"
                            " engineering discipline."
                        ],
                    },
                    {
                        "eocSpecific": 4,
                        "description": "Discernment of knowledge development and research directions within the engineering discipline.",
                        "indicatorsOfAttainment": [
                            "Identifies and critically appraises current developments, advanced technologies, emerging issues and interdisciplinary"
                            " linkages in at least one specialist practice domain of the engineering discipline.",
                            "Interprets and applies selected research literature to inform engineering application in at least one specialist domain"
                            " of the engineering discipline.",
                        ],
                    },
                    {
                        "eocSpecific": 5,
                        "description": "Knowledge of engineering design practice and contextual factors impacting the engineering discipline.",
                        "indicatorsOfAttainment": [
                            "Identifies and applies systematic principles of engineering design relevant to the engineering discipline.",
                            "Identifies and understands the interactions between engineering systems and people in the social, cultural,"
                            " environmental, commercial, legal and political contexts in which they operate, including both the positive role of"
                            " engineering in sustainable development and the potentially adverse impacts of engineering activity in the engineering"
                            " discipline. ",
                            "Appreciates the issues associated with international engineering practice and global operating contexts",
                            "Is aware of the founding principles of human factors relevant to the engineering discipline.",
                            "Is aware of the fundamentals of business and enterprise management.",
                            "Identifiesthe structure, roles and capabilities of the engineering workforce.",
                        ],
                    },
                    {
                        "eocSpecific": 6,
                        "description": (
                            "Understanding of the scope, principles, norms, accountabilities and bounds of sustainable engineering practice in the"
                            " specific discipline."
                        ),
                        "indicatorsOfAttainment": [
                            "Appreciates the basis and relevance of standards and codes of practice, as well as legislative and statutory"
                            " requirements applicable to the engineering discipline.",
                            "Appreciates the principles of safety engineering, risk management and the health and safety responsibilities of the"
                            " professional engineer, including legislative requirements applicable to the engineering discipline.",
                            "Appreciatesthe social, environmental and economic principles of sustainable engineering practice.",
                            "Understands the fundamental principles of engineering project management as a basis for planning, organising and"
                            " managing resources.",
                            "Appreciates the formal structures and methodologies of systems engineering as a holistic basis for managing complexity"
                            " and sustainability in engineering practice. ",
                        ],
                    },
                ],
            },
            {
                "eocGeneral": 2,
                "title": "Engineering Application Ability",
                "eocSpecifics": [
                    {
                        "eocSpecific": 1,
                        "description": "Application of established engineering methods to complex engineering problem solving.",
                        "indicatorsOfAttainment": [
                            "Identifies, discerns and characterises salient issues, determines and analyses causes and effects, justifies and applies"
                            " appropriate simplifying assumptions, predicts performance and behaviour, synthesises solution strategies and develops"
                            " substantiated conclusions.",
                            "Ensures that all aspects of an engineering activity are soundly based on fundamental principles - by diagnosing, and"
                            " taking appropriate action with data, calculations, results, proposals, processes, practices, and documented information"
                            " that may be ill-founded, illogical, erroneous, unreliable or unrealistic.",
                            "Competently addresses complex engineering problems which involve uncertainty, ambiguity, imprecise information and"
                            " wide-ranging and sometimes conflicting technical and non-technical factors.",
                            "Investigates complex problems using research-based knowledge and research methods.",
                            "Partitions problems, processes or systems into manageable elements for the purposes of analysis, modelling or design and"
                            " then re-combines to form a whole, with the integrity and performance of the overall system as the paramount"
                            " consideration.",
                            "Conceptualises alternative engineering approaches and evaluates potential outcomes against appropriate criteria to"
                            " justify an optimal solution choice.",
                            "Critically reviews and applies relevant standards and codes of practice underpinning the engineering discipline and"
                            " nominated specialisations.",
                            "Identifies, quantifies, mitigates and manages technical, health, environmental, safety and other contextual risks"
                            " associated with engineering application in the designated engineering discipline.",
                            "Interprets and ensures compliance with relevant legislative and statutory requirements applicable to the engineering"
                            " discipline.",
                        ],
                    },
                    {
                        "eocSpecific": 2,
                        "description": "Fluent application of engineering techniques, tools and resources.",
                        "indicatorsOfAttainment": [
                            "Proficiently identifies, selects and applies the materials, components, devices, systems, processes, resources, plant"
                            " and equipment relevant to the engineering discipline.",
                            "Constructs or selects and applies from a qualitative description of a phenomenon, process, system, component or device a"
                            " mathematical, physical or computational model based on fundamental scientific principles and justifiable simplifying"
                            " assumptions.",
                            "Determines properties, performance, safe working limits, failure modes, and other inherent parameters of materials,"
                            " components and systems relevant to the engineering discipline.",
                            "Applies a wide range of engineering tools for analysis, simulation, visualisation, synthesis and design, including"
                            " assessing the accuracy and limitations of such tools, and validation of their results.",
                            "Applies formal systems engineering methods to address the planning and execution of complex, problem solving and"
                            " engineering projects.",
                            "Designs and conducts experiments, analyses and interprets result data and formulates reliable conclusions.",
                            "Analyses sources of error in applied models and experiments; eliminates, minimises or compensates for such errors;"
                            " quantifies significance of errors to any conclusions drawn.",
                            "Safely applies laboratory, test and experimental procedures appropriate to the engineering discipline.",
                            "Understands the need for systematic management of the acquisition, commissioning, operation, upgrade, monitoring and"
                            " maintenance of engineering plant, facilities, equipment and systems.",
                            "Understands the role of quality management systems, tools and processes within a culture of continuous improvement.",
                        ],
                    },
                    {
                        "eocSpecific": 3,
                        "description": "Application of systematic engineering synthesis and design processes.",
                        "indicatorsOfAttainment": [
                            "Proficiently applies technical knowledge and open ended problem solving skills as well as appropriate tools and"
                            " resources to design components, elements, systems, plant, facilities and/or processes to satisfy user requirements.",
                            "Addresses broad contextual constraints such as social, cultural, environmental, commercial, legal political and human"
                            " factors, as well as health, safety and sustainability imperatives as an integral part of the design process.",
                            "Executes and leads a whole systems design cycle approach including tasks such as: determining client requirements and"
                            " identifying the impact of relevant contextual factors, including business planning and costing targets; systematically"
                            " addressing sustainability criteria; working within projected development, production and implementation constraints;"
                            " eliciting, scoping and documenting the required outcomes of the design task and defining acceptance criteria;"
                            " identifying assessing and managing technical, health and safety risks integral to the design process; writing"
                            " engineering specifications, that fully satisfy the formal requirements; ensuring compliance with essential engineering"
                            " standards and codes of practice; partitioning the design task into appropriate modular, functional elements; that can"
                            " be separately addressed and subsequently integrated through defined interfaces; identifying and analysing possible"
                            " design approaches and justifying an optimal approach; developing and completing the design using appropriate"
                            " engineering principles, tools, and processes; integrating functional elements to form a coherent design solution;"
                            " quantifying the materials, components, systems, equipment, facilities, engineering resources and operating arrangements"
                            " needed for implementation of the solution; checking the design solution for each element and the integrated system"
                            " against the engineering specifications; devising and documenting tests that will verify performance of the elements and"
                            " the integrated realisation; prototyping/implementing the design solution and verifyingperformance against"
                            " specification; documenting, commissioning and reporting the design outcome.",
                            "Is aware of the accountabilities of the professional engineer in relation to the ‘design authority’ role.",
                        ],
                    },
                    {
                        "eocSpecific": 4,
                        "description": "Application of systematic approaches to the conduct and management of engineering projects.",
                        "indicatorsOfAttainment": [
                            "Contributes to and/or manages complex engineering project activity, as a member and/or as the leader of an engineering"
                            " team.",
                            "Seeks out the requirements and associated resources and realistically assesses the scope, dimensions, scale of effort"
                            " and indicative costs of a complex engineering project.",
                            "Accommodates relevant contextual issues into all phases of engineering project work, including the fundamentals of"
                            " business planning and financial management",
                            "Proficiently applies basic systems engineering and/or project management tools and processes to the planning and"
                            " execution of project work, targeting the delivery of a significant outcome to a professional standard.",
                            "Is aware of the need to plan and quantify performance over the full life-cycle of a project, managing engineering"
                            " performance within the overall implementation context.",
                            "Demonstrates commitment to sustainable engineering practices and the achievement of sustainable outcomes in all facets"
                            " of engineering project work.",
                        ],
                    },
                ],
            },
            {
                "eocGeneral": 3,
                "title": "Professional and Personal Attributes",
                "eocSpecifics": [
                    {
                        "eocSpecific": 1,
                        "description": "Ethical conduct and professional accountability",
                        "indicatorsOfAttainment": [
                            "Demonstrates commitment to uphold the Engineers Australia Code of Ethics, and established norms of professional conduct"
                            " pertinent to the engineering discipline.",
                            "Understands the need for 'due-diligence' in certification, compliance and risk management processes.",
                            "Understands the accountabilities of the professional engineer and the broader engineering team for the safety of other"
                            " people and for protection of the environment.",
                            "Is aware of the fundamental principles of intellectual property rights and protection.",
                        ],
                    },
                    {
                        "eocSpecific": 2,
                        "description": "Effective oral and written communication in professional and lay domains",
                        "indicatorsOfAttainment": [
                            "Is proficient inlistening, speaking, reading and writing English, including: comprehending critically and fairly the"
                            " viewpoints of others; expressing information effectively and succinctly, issuing instruction, engaging in discussion,"
                            " presenting arguments and justification, debating and negotiating - to technical and non-technical audiences and using"
                            " textual, diagrammatic, pictorial and graphical media best suited to the context; representing an engineering position,"
                            " or the engineering profession at large to the broader community; appreciating the impact of body language, personal"
                            " behaviour and other non-verbal communication processes, as well as the fundamentals of human social behaviour and their"
                            " cross-cultural differences.",
                            "Prepares high quality engineering documents such as progress and project reports, reports of investigations and"
                            " feasibility studies, proposals, specifications, design records, drawings, technical descriptions and presentations"
                            " pertinent to the engineering discipline.",
                        ],
                    },
                    {
                        "eocSpecific": 3,
                        "description": "Creative, innovative and pro-active demeanour",
                        "indicatorsOfAttainment": [
                            "Applies creative approaches to identify and develop alternative concepts, solutions and procedures, appropriately"
                            " challenges engineering practices from technical and non-technical viewpoints; identifies new technological"
                            " opportunities. ",
                            "Seeks out new developments in the engineering discipline and specialisations and applies fundamental knowledge and"
                            " systematic processes to evaluate and report potential.",
                            "Is aware of broader fields of science, engineering, technology and commerce from which new ideas and interfaces may be"
                            " drawn and readily engages with professionals from these fields to exchange ideas.",
                        ],
                    },
                    {
                        "eocSpecific": 4,
                        "description": "Professional use and management of information",
                        "indicatorsOfAttainment": [
                            "Is proficient in locating and utilising information -including accessing, systematically searching, analysing,"
                            " evaluating and referencing relevant published works and data; is proficient in the use of indexes, bibliographic"
                            " databases and other search facilities.",
                            "Critically assesses the accuracy, reliability and authenticity of information.",
                            "Is aware of common document identification, tracking and control procedures.",
                        ],
                    },
                    {
                        "eocSpecific": 5,
                        "description": "Orderly management of self, and professional conduct",
                        "indicatorsOfAttainment": [
                            "Demonstrates commitment to critical self-review and performance evaluation against appropriate criteria as a primary"
                            " means of tracking personal development needs and achievements.",
                            "Understands the importance of being a member of aprofessional and intellectual community, learning from its knowledge"
                            " and standards, and contributing to their maintenance and advancement.",
                            "Demonstrates commitment to life-long learning and professional development.",
                            "Manages time and processes effectively, prioritises competing demands to achieve personal, career and organisational"
                            " goals and objectives.",
                            "Thinks critically and applies an appropriate balance of logic and intellectual criteria to analysis, judgement and"
                            " decision making.",
                            "Presents a professional image in all circumstances, including relations with clients, stakeholders, as well as with"
                            " professional and technical colleagues across wide ranging disciplines.",
                        ],
                    },
                    {
                        "eocSpecific": 6,
                        "description": "Effective team membership and team leadership",
                        "indicatorsOfAttainment": [
                            "Understands the fundamentals of team dynamics and leadership.",
                            "Functions as an effective member or leader of diverse engineering teams, including those with multi-level,"
                            " multi-disciplinary and multi-cultural dimensions.",
                            "Earns the trust and confidence of colleagues through competent and timely completion of tasks.",
                            "Recognises the value of alternative and diverse viewpoints, scholarly advice and the importance of professional"
                            " networking.",
                            "Confidently pursues and discerns expert assistance and professional advice.",
                            "Takes initiative and fulfils the leadership role whilst respecting the agreed roles of others.",
                        ],
                    },
                ],
            },
        ]

        for eocGeneral in BASE_EOC:
            eocGeneral_obj = EOCGeneral.objects.create(
                number=eocGeneral["eocGeneral"],
                title=eocGeneral["title"],
                eoc_set=base_eoc_set,
            )
            for eocSpecific in eocGeneral["eocSpecifics"]:
                EOCSpecific.objects.create(
                    number=eocSpecific["eocSpecific"],
                    description=eocSpecific["description"],
                    eoc_general=eocGeneral_obj,
                    indicators_of_attainment=eocSpecific["indicatorsOfAttainment"],
                )


class Command(BaseCommand):
    help = "Bootstrap Dev Environment"

    def handle(self, *args, **options):
        add_groups()
        add_users()
        add_default_eoc_set()


def add_groups():
    print("----------------------------------")
    print("Creating/Checking Django Groups...")
    for group_data in GROUPS:
        group, created = Group.objects.get_or_create(name=group_data[0])
        group_action = "Created" if created else "Already Exists"
        print(f"{group_action} group: {group_data[0]}")
        for group_permission in group_data[1]:
            app_label = group_permission[0]
            model = group_permission[1]
            codename = group_permission[2]

            perm = Permission.objects.get(
                codename=codename,
                content_type__model=model,
                content_type__app_label=app_label,
            )
            group.permissions.add(perm)
            print(f"Added permission {group_permission} to {group}")


def add_users():
    print("-----------------------------------------")
    print("Creating/Checking Django user accounts...")

    USER_IS_STAFF_INDEX = -1
    USER_GROUP_INDEX = -2
    CREATE_USER_INDEX_LIMIT = 3

    if settings.APP_ENV in ["LOCAL", "CI"]:
        user_model = get_user_model()
        for user_data in USERS:
            try:
                username = user_data[0]
                if user_model.objects.filter(username__iexact=username).exists():
                    # Do not create if already exists
                    print(f"User account already exists ({username}), skipping creation")
                else:
                    # Create user
                    user = user_model.objects.create_user(*user_data[:CREATE_USER_INDEX_LIMIT])

                    # Set as staff or not
                    user.is_staff = user_data[USER_IS_STAFF_INDEX]
                    user.save()
                    print(f"Created user account: {user}")

                    # assign groups
                    group_defined = user_data[USER_GROUP_INDEX]
                    if group_defined:
                        group = Group.objects.get(name=group_defined)
                        user.groups.add(group)
                        print(f"Added user `{user}` to group `{group}`")

            except Exception as e:
                print("ERROR: User creation/check failed: ", e)
    else:
        print(
            "We only create user accounts in non-production environments \n",
            f"Environment detected: {settings.APP_ENV} \n",
        )
