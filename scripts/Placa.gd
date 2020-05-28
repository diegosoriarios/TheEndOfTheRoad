extends Node2D

var images = ["res://assets/sign/left.png", "res://assets/sign/100.png", "res://assets/sign/80.png", "res://assets/sign/right.png", "res://assets/sign/rotatoria.png"]

func _ready():
	images.shuffle()
	
	var img = Image.new()
	var texture = ImageTexture.new()
	img.load(images.front())
	texture.create_from_image(img)
	$limite.texture = texture

func _process(delta):
	position.x -= 3
	
	if position.x < -2:
		queue_free()
	
	
