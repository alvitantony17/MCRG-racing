class Game {
  constructor() {
    this.resetButton=createButton("")
    this.resetTitle=createElement("h2")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
    this.leaderTitle=createElement("h2")
    this.leftKeyActive=false
    this.playerMoving=false
    
  }
  getState(){
    var gameStateRef=database.ref("gameState")
    gameStateRef.on("value",function(data){
      gameState=data.val()
    })
  }

  update(state){
    database.ref("/").update({
      gameState:state
    })
  }

  test(){
    console.log("test??????????????")
  }

  start() {
    console.log("START")
    form = new Form();
    form.display();
    player = new Player();
    playerCount=player.getCount()
    car1 = createSprite(width/2-50,height - 100)
    car1.addImage("car1Image",car1Image)
    car1.scale=0.07
    car2 = createSprite(width/2+100,height - 100)
    car2.addImage("car2Image",car2Image)
    car2.scale=0.07
    cars=[car1,car2]
    fuels=new Group()
    coins=new Group()
    obstacles=new Group()
    var obstaclesPositions=[
      {x:width/2+250,y:height-800,image:obstacle2Image},
      {x:width/2-150,y:height-1300,image:obstacle1Image},
      {x:width/2+250,y:height-1800,image:obstacle1Image},
      {x:width/2-180,y:height-2300,image:obstacle2Image},
      {x:width/2,y:height-2800,image:obstacle2Image},
      {x:width/2-180,y:height-3300,image:obstacle1Image},
      {x:width/2+180,y:height-3300,image:obstacle2Image},
      {x:width/2+250,y:height-3800,image:obstacle2Image},
      {x:width/2-150,y:height-4300,image:obstacle1Image},
      {x:width/2+250,y:height-4800,image:obstacle2Image},
      {x:width/2,y:height-5300,image:obstacle1Image},
      {x:width/2-180,y:height-5500,image:obstacle2Image},
    ]
    //this.spawningObstacles()
    //this.refill()
    this.addSprites(4,fuels,fuelImage,0.02)
    this.addSprites(18,coins,coinImage,0.09)
    this.addSprites(obstaclesPositions.length,obstacles,obstacle1Image,0.04,obstaclesPositions)
    
  }
  handleElements(){
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    this.resetButton.position(width/2+230,100)
    this.resetButton.class("resetButton")
    this.resetTitle.class("resetText")
    this.resetTitle.html("Reset Game")
    this.resetTitle.position(width/2+200,40)

    this.leaderTitle.class("resetText")
    this.leaderTitle.html("Leaderboard")
    this.leaderTitle.position(width/3-60,40)


    this.leader1.position(width/3-50,80)
    this.leader1.class("leadersText")

    this.leader2.position(width/3-50,130)
    this.leader2.class("leadersText")
  }
  
  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    
    //this.showRank()
    if(allPlayers != undefined){
      image(trackImage,0,-height*5,width,height*6)
      this.showFuel()
      this.showLife()
      this.showLeaderBoard()
      var index = 0
      for(var plr in allPlayers){

        index = index + 1
        var x = allPlayers[plr].positionX
        var y = allPlayers[plr].positionY

        cars[index-1].position.x = x
        cars[index-1].position.y = y
        if(index===player.index){
          fill("cyan")
          stroke(10)
          ellipse (x,y,60,60)
          camera.position.y=cars[index-1].position.y
          //camera.position.x=cars[index-1].position.x
        }
        
      }
      //if(this.playerMoving){
        //player.positionY+=5
        //player.update()
      //}
      this.handlePlayerControls()
      this.handleFuel(index)
      this.handlePowerCoins(index)
      const finishLine = height*6-100
      if(player.positionY>finishLine){
        gameState=2
        player.rank+=1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }

      
      drawSprites()
    }
  } 

  handlePlayerControls(){
    if(keyIsDown(UP_ARROW)){
      player.positionY -= 10
      player.update()
    }
    if(keyIsDown(DOWN_ARROW)){
      player.positionY += 10
      player.update()
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX>width/4+80){
      this.leftKeyActive=true
      player.positionX -= 5
      player.update()
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
      this.leftKeyActive=false
      player.positionX += 5
      player.update()
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        players:{}
      })
      window.location.reload()
    })
    
  }

  handleFuel(index){
   cars[index-1].overlap(fuels,function(collector,collected){
    player.fuel=185
    collected.remove()
  })
    if(player.fuel>0 && this.playerMoving){
      player.fuel-=0.3
    }
    if(player.fuel<=0){
      gameState=2
      this.gameOver()
    }
   
  }

  handlePowerCoins(index){
    cars[index-1].overlap(coins,function(collector,collected){
      player.score += 21
      player.update()
      collected.remove()
  })
}

showLife() {
  push();
  image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
  fill("white");
  rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
  fill("#f50057");
  rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
  noStroke();
  pop();
}

showFuel() {
  push();
  image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
  fill("white");
  rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
  fill("#ffc400");
  rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
  noStroke();
  pop();
}

 /*spawningObstacles() {
    for(var i =0 ; i<18 ; i++){
      var coinPositionX=Math.round(random(width/2-150,width/2+150))
    var coinPositionY=Math.round(random(-height*4.5,height-400))
    coin=createSprite(coinPositionX,coinPositionY)
    coin.addImage("coin", coinImage)
    coin.scale=0.09
    }
   }*/
   
  /*refill(){
    for(var i=0 ; i<4 ; i++){
     var fuelPositionX=Math.round(random(width/2-150,width/2+150))
    var fuelPositionY=Math.round(random(-height*4.5,height-400))
    fuel=createSprite(fuelPositionX,fuelPositionY)
    fuel.addImage("fuel", fuelImage)
    fuel.scale=0.02
    }
  }*/

  addSprites(numOfSprites,spriteGroup,spriteImage,scale,positions=[]){
    for(var i=0 ; i<numOfSprites ; i++){
      var x,y
      if(positions.length>0){
        x=positions[i].x;
        y=positions[i].y;
        spriteImage=positions[i].image
      }
      else{ 
     var x=Math.round(random(width/2-150,width/2+150))
     var y=Math.round(random(-height*4.5,height-400))
      }
     var sprite=createSprite(x,y)
     sprite.addImage("sprite",spriteImage)
     sprite.scale=scale
     spriteGroup.add(sprite)
     }
  }
    
   

  showLeaderBoard(){
    var leader1 , leader2
    var players = Object.values(allPlayers)
    if(
      (players[0].rank===0 && players[1]===0 || players[0].rank===1)
    ){
      leader1=
      players[0].rank+
      "&emsp;" +
      players[0].name+
      "&emsp;" +
      players[0].score
      leader2=
      players[1].rank+
      "&emsp;" +
      players[1].name+
      "&emsp;" +
      players[1].score
    }
    if(players[1].rank==1){
      leader1=
      players[1].rank+
      "&emsp;" +
      players[1].name+
      "&emsp;" +
      players[1].score

      leader2=
      players[0].rank+
      "&emsp;" +
      players[0].name+
      "&emsp;" +
      players[0].score
    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over !! TRY AGAIN...`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }

  end() {
    console.log("Game Over");
  }
}
  

