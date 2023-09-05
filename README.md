## File Directory System

### Link

### Project Overview

The File Directory System is a command-line interface that allows users to interact with a simulated file directory. 
Users can issue various commands to manipulate and navigate the file system. Supported commands include:

- `ls`: Show the list of files and directories in the current directory.
- `touch`: Create a new file.
- `mkdir`: Create a new directory.
- `cd`: Change to a different file or directory.
- `pwd`: Display the current path.
- `rm`: Delete files or directories.
- `clear`: Clear the command history on the screen.

### Motivation

This project serves as a practical exercise in data structures and object-oriented programming (OOP). 
It was created as part of a learning initiative offered by Recursion, a computer science platform.

### Technology Stack

The File Directory System is implemented using the following technologies:

- HTML
- CSS
- TypeScript

### File Structure Implementation

The file structure is realized using a linked list. Each directory is represented as a node, containing various data, including its children in the linked list.
To distinguish between directories and files, the "children" property is set to null for files.

The children of a directory are managed as a singly linked list, with a "head" and "next" pointer. Each sibling child is placed in the "next" as another node,
allowing directories to contain multiple files. This design reduces the time complexity for searching for a targeted node to O(n) in the worst case.

### Command History Implementation

The command history feature allows users to access previously executed commands, facilitating command reuse.
It is implemented using the `CommandHistory` class, which uses a doubly linked list structure.
The "head" and "current" nodes hold the command name, "prev," and "next." This design enables quick access to the last or next command in O(1) time complexity.

### MVC Architecture

The project follows the Model-View-Controller (MVC) architectural pattern to organize its structure:

- **Model**: Represents the application's data and business logic.
- **View**: Responsible for displaying data to the user and presenting the user interface.
- **Controller**: Acts as an intermediary between the Model and the View.

The MVC pattern separates concerns within the application, making development, maintenance, and extension easier.
It promotes a clear division of labor and allows for modularity and scalability.

### Potential Improvements

There is room for further optimization to reduce the time complexity of reaching the target node. 
One potential enhancement is to convert node names into numeric values, potentially reducing time complexity from O(n) to O(log n).

Additional commands, such as move, copy, or handling hidden files, could be added to enhance functionality.
