extends Node2D

var images = ["res://icon.png", "res://icon.png", "res://icon.png"]
onready var db = preload("res://scripts/db.gd").new()
onready var sprite = $Sprite

var h_name
var h_ask
var places = []
var surname

func _ready():
	randomize()
	var random = rand_range(0, 7)

	var img = Image.new()
	var texture = ImageTexture.new()
	
	surname = db.surnames[int(rand_range(0, 40))]
	
	if random < 3:
		img.load(images[0])
		h_name = db.names[int(rand_range(0, 40))] + " " + surname
		places.append(h_name)
		h_ask = db.askPhrases[int(rand_range(0, db.askPhrases.size()))]
	elif random < 5:
		img.load(images[1])
		h_name = db.names[int(rand_range(0, 40))] + " " + surname
		places.append(h_name)
		h_name = db.names[int(rand_range(0, 40))] + " " + surname
		places.append(h_name)
		h_ask = db.askPhrases[int(rand_range(0, db.askPhrasesSon.size()))]
	else:
		img.load(images[2])
		h_name = db.names[int(rand_range(0, 40))] + " " + surname
		places.append(h_name)
		h_name = db.names[int(rand_range(0, 40))] + " " + surname
		places.append(h_name)
		h_name = db.names[int(rand_range(0, 40))] + " " + surname
		places.append(h_name)
		h_ask = db.askPhrases[int(rand_range(0, db.askPhrasesSons.size()))]
	
	texture.create_from_image(img)
	sprite.texture = texture

func _process(delta):
	if !get_parent().pause:
		position.x -= 3
	
		if position.x < -2:
			queue_free()
