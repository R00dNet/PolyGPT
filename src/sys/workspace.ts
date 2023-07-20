import fs from "fs";
import path from "path";

export class Workspace {
  constructor(
    private _workspacePath: string = path.join(__dirname, "../workspace")
  ) {
    // Fully resolve the workspace path
    this._workspacePath = path.resolve(
      this._workspacePath
    );

    // Initialize the directory
    if (!fs.existsSync(this._workspacePath)) {
      fs.mkdirSync(
        this._workspacePath,
        { recursive: true }
      );
    }
  }

  toWorkspacePath(subpath: string): string {
    const absPath = path.isAbsolute(subpath) ?
      subpath :
      path.resolve(path.join(this._workspacePath, subpath));

    if (absPath.indexOf(this._workspacePath) !== 0) {
      throw Error(
        `Path must be within workspace directory. Path: ${subpath}\n` +
        `Workspace: ${this._workspacePath}`
      );
    }

    return absPath;
  }

  writeFileSync(subpath: string, data: string): void {
    const absPath = this.toWorkspacePath(subpath);
    fs.writeFileSync(absPath, data);
  }

  readFileSync(subpath: string): string {
    const absPath = this.toWorkspacePath(subpath);
    return fs.readFileSync(absPath, "utf-8");
  }

  existsSync(subpath: string): boolean {
    const absPath = this.toWorkspacePath(subpath);
    return fs.existsSync(absPath);
  }
}
