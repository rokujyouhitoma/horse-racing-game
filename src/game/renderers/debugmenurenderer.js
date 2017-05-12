"use strict";

/**
 * @constructor
 */
var DebugMenuRenderer = function(scene){
    this.dom = null;
    this.events = [
        [Events.GameScene.OnEnter, this.OnEnter.bind(this), scene],
        [Events.GameScene.OnExit, this.OnExit.bind(this), scene],
        [Events.Debug.OnResetGame, this.OnResetGame.bind(this), null],
        [Events.Debug.OnResetRace, this.OnResetRace.bind(this), null],
        [Events.Debug.OnPlayCard, this.OnPlayCard.bind(this), null],
        [Events.Debug.OnUndoPlayCard, this.OnUndoPlayCard.bind(this), null],
        [Events.Debug.OnPlayRankCard, this.OnPlayRankCard.bind(this), null],
        [Events.Debug.OnPlayDashCard, this.OnPlayDashCard.bind(this), null],
        [Events.Debug.OnMove, this.OnMove.bind(this), null],
        [Events.Debug.OnCheckRelationship, this.OnCheckRelationship.bind(this), null],
    ];
    this.events.forEach(function(event){
        Game.Publisher.Subscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnEnter = function(e){
    var elements = document.getElementsByTagName("body");
    if(elements.length > 0){
        var body = elements[0];
        var section = document.createElement("section");
        section.className = "debug_menu";
        var h1 = document.createElement("h1");
        h1.innerText = "Debug Menu";
        section.appendChild(h1);
        this.dom = section;
        Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
            body.appendChild(section);
        }));
    }
    var buttons = [
        ["Reset \uD83C\uDFAE", function(){Game.Publisher.Publish(Events.Debug.OnResetGame, this);}],
        ["Reset \uD83C\uDFC7", function(){Game.Publisher.Publish(Events.Debug.OnResetRace, this);}],
        ["Play PlayCard", function(){Game.Publisher.Publish(Events.Debug.OnPlayCard, this);}],
        ["Play Undo PlayCard", function(){Game.Publisher.Publish(Events.Debug.OnUndoPlayCard, this);}],
        ["Play RankCard", function(){Game.Publisher.Publish(Events.Debug.OnPlayRankCard, this);}],
        ["Play DashCard", function(){Game.Publisher.Publish(Events.Debug.OnPlayDashCard, this);}],
        ["Check Relationship", function(){Game.Publisher.Publish(Events.Debug.OnCheckRelationship, this);}],
    ].map(function(value){
        var button = (new UIButton(value[0])).DOM();
        button.addEventListener("click", value[1]);
        return button;
    }).forEach(function(dom){
        this.dom.appendChild(dom);
    }, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnExit = function(e){
    Game.RenderCommandExecuter.Push(new FunctionCommand(function(){
        this.dom.parentNode.removeChild(this.dom);
    }.bind(this)));
    this.events.forEach(function(event){
        Game.Publisher.UnSubscribe(event[0], event[1], event[2]);
    });
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnResetGame = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnResetGame, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnResetRace = function(e){
    Game.Publisher.Publish(Events.GameDirector.OnNewRace, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnPlayCard = function(e){
    Game.Publisher.Publish(Events.Race.OnPlayCard, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnUndoPlayCard = function(e){
    Game.Publisher.Publish(Events.Race.OnUndoPlayCard, this);
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnPlayRankCard = function(e){
    var race = Game.Locator.locate(GameDirector).race;
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var name = "RankCard";
    var repository = repositoryDirector.Get(name);
    var detail_id = 1;
    var card = repository.Find(detail_id);
    var cardEffect = race.Apply(card);
    cardEffect.Apply();
    Game.Log(card.LogMessage());
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnPlayDashCard = function(e){
    var race = Game.Locator.locate(GameDirector).race;
    var repositoryDirector = Game.Locator.locate(RepositoryDirector);
    var name = "DashCard";
    var repository = repositoryDirector.Get(name);
    var detail_id = 1 + 1;
    var card = repository.Find(detail_id);
    var cardEffect = race.Apply(card);
    cardEffect.Apply();
    Game.Log(card.LogMessage());
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnMove = function(e){
    var index = e.payload["index"];
    Game.Locator.locate(GameDirector).race.gameBoard.racetrack.lanes[index].position += 1;
};

/**
 * @param {ExEvent} e The event object.
 */
DebugMenuRenderer.prototype.OnCheckRelationship = function(e){
    var checker = new RelationshipChecker()
    checker.CheckAll([
        "HorseFigure",
        "MonsterCoin",
        "MonsterFigure",
        "Race",
        "PlayCard",
        "StepCard",
        "RankCard",
        "DashCard",
    ]);
};
