# .NET IDE Extension for Visual Studio Code

This Visual Studio Code extension brings essential features from a full-fledged IDE to improve the .NET development experience in VS Code. With this extension, you can easily manage NuGet packages, add references to DLLs or projects, and manipulate solutions more efficiently.

## Features

### 1. **Add NuGet Package References**
   - Easily add NuGet packages to your .NET project directly from within VS Code.
   - Search for available NuGet packages and add them to your project without leaving your editor.

### 2. **Add DLL References**
   - Add external DLL references to your project by simply selecting the DLL file.
   - Supports referencing both local and external libraries in your .NET projects.

### 3. **Add Projects to Solution**
   - Add existing .NET projects to your current solution.
   - Automatically updates the solution file with the new project reference.

## Installation

1. Open Visual Studio Code.
2. Go to the **Extensions** view by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for **.NET IDE Extension**.
4. Click **Install** to add the extension to your workspace.

Alternatively, you can install it via the command palette (`Ctrl+Shift+P`) by searching for "Extensions: Install Extensions" and then searching for **.NET IDE Extension**.

## Usage

### Add NuGet Package
1. Open the command palette (`Ctrl+Shift+P`).
2. Type `Add NuGet Package`.
3. Search for the desired package by name and select it.
4. The package will be added to your project, and the project file will be automatically updated.

### Add DLL Reference
1. Open the command palette (`Ctrl+Shift+P`).
2. Type `Add DLL Reference`.
3. Browse to the location of the DLL file and select it.
4. The reference will be added to your project, and the project file will be updated.

### Add Project to Solution
1. Open the command palette (`Ctrl+Shift+P`).
2. Type `Add Project to Solution`.
3. Select the existing project you want to add to the current solution.
4. The solution file will be updated to include the new project.

## Requirements

- Visual Studio Code
- .NET SDK (make sure you have the .NET SDK installed for project management and NuGet integration)

## Contributing

Feel free to contribute to the extension by submitting issues and pull requests. If you'd like to add new features or improve the functionality, we welcome your contributions!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Enhance your .NET development experience in VS Code and make project management seamless with the .NET IDE Extension. Happy coding!
