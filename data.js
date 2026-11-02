// Your articles live here. To add one, copy a block and change the text.
// Remember the comma after every article except the last one.
const articles = [
  {
    id: 1,
    title: "Algorithm",
    category: "Basics",
    summary: "A step-by-step set of instructions for solving a problem.",
    content: [
      "An algorithm is a finite list of clear steps that solves a problem or completes a task. A recipe is a good everyday example: follow the steps in order and you get the result.",
      "In computer science, algorithms are judged by how correct they are and how efficient they are, meaning how much time and memory they need as the input grows.",
      "Famous examples include sorting algorithms, which put data in order, and search algorithms, which find an item in a collection."
    ]
  },
  {
    id: 2,
    title: "Binary",
    category: "Basics",
    summary: "The number system of 0s and 1s that computers use.",
    content: [
      "Binary is a base-2 number system that uses only two digits: 0 and 1. Each digit is called a bit.",
      "Computers use binary because their electronic parts have two states, such as on and off. Every number, letter, picture and song is stored as a long pattern of bits.",
      "For example, the decimal number 5 is written as 101 in binary, because it is 4 + 0 + 1."
    ]
  },
  {
    id: 3,
    title: "Internet",
    category: "Networks",
    summary: "A global network of connected computers.",
    content: [
      "The internet is a worldwide network that connects billions of devices. Data travels between them in small pieces called packets.",
      "Each device has an address called an IP address, which works like a home address for sending and receiving data.",
      "The internet is not the same as the World Wide Web. The web is just one service that runs on top of the internet, alongside email and file sharing."
    ]
  },
  {
    id: 4,
    title: "Database",
    category: "Data",
    summary: "An organized collection of information that can be searched quickly.",
    content: [
      "A database is a structured collection of data stored so it can be easily added to, searched and updated.",
      "Many databases store data in tables made of rows and columns. A language called SQL is commonly used to ask these databases questions.",
      "Examples of everyday use include a school's student records, a shop's stock list and the accounts on a social media site."
    ]
  },
  {
    id: 5,
    title: "Variable",
    category: "Programming",
    summary: "A named box that stores a value in a program.",
    content: [
      "A variable is a name given to a place in memory where a program keeps a value. The value can change while the program runs.",
      "For example, a game might have a variable called score. It starts at 0 and goes up every time you collect a coin.",
      "Variables can hold different kinds of data, such as numbers, text or true/false values."
    ]
  },
  {
    id: 6,
    title: "Loop",
    category: "Programming",
    summary: "A way to repeat instructions without writing them again and again.",
    content: [
      "A loop repeats a block of code until a condition is met. It saves time and keeps programs short.",
      "A for loop repeats a set number of times, while a while loop keeps going as long as a condition stays true.",
      "Be careful of infinite loops, which never stop because their condition never becomes false."
    ]
  },
  {
    id: 7,
    title: "Encryption",
    category: "Security",
    summary: "Scrambling data so only the right people can read it.",
    content: [
      "Encryption turns readable data into scrambled data using a key. Only someone with the correct key can turn it back.",
      "One of the oldest examples is the Caesar cipher, where each letter is shifted a fixed number of places in the alphabet.",
      "Modern encryption protects passwords, messages and online payments. The padlock in your browser's address bar means the connection is encrypted."
    ]
  },
  {
    id: 8,
    title: "Operating System",
    category: "Systems",
    summary: "The software that manages a computer's hardware and programs.",
    content: [
      "An operating system, or OS, is the main software that runs a computer. It manages memory, storage, the processor and connected devices.",
      "It also provides the interface you use, and it lets other programs run without each one needing to control the hardware directly.",
      "Common examples are Windows, macOS, Linux, Android and iOS."
    ]
  }
];
