import { Request, Response } from "express";

export class ExampleController {
  public async example(_: Request, res: Response) {
    res.json({
      message: 'Hello'
    })
  }
}