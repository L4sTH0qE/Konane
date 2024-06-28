/**
 * Class that describes Player model.
 */
export class Player {
    constructor(color) {
        this._color = color;
        this._isFirstTurn = true;
        this._name = "";
        this._isBot = "";
    }
}