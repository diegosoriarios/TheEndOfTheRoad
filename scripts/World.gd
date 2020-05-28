extends Node2D

onready var posts = $posts
onready var spawn = $Spawn
onready var Placa = preload("res://scenes/Placa.tscn")
onready var Hicker = preload("res://scenes/Hicker.tscn")
onready var Dialog = preload("res://scenes/Dialog.tscn")
onready var Talk = preload("res://scenes/Talk.tscn")
var target
var pause = false
var dialog = null
var carSpots = 4

var frame = 0
var places = []

func _ready():
	randomize()
	var placa = Placa.instance()
	placa.position = spawn.position


func _process(delta):
	if pause:
		if target.is_in_group("hicker"):
			if dialog == null:
				dialog = Dialog.instance()
				dialog.position.x = 345
				dialog.position.y = 201
				dialog.find_node("Name").text = target.places[0]
				dialog.find_node("Description").text = target.h_ask
				dialog.z_index = 10
				add_child(dialog)
	else:
		frame += delta * 10
		
		#print(frame)
		
		#if frame > 100:
		if frame > 30:
			#var option = rand_range(0, 4)
			var option = 1
			if option == 0: generate_placa()
			if option == 1: generate_hicker()
			frame = 0
		
		posts.position.x -= 3
		if posts.position.x <= -251:
			posts.position.x = 0
		
		if target:
			pause = true

func generate_placa():
	var placa = Placa.instance()
	placa.position = spawn.position
	add_child(placa)

func generate_hicker():
	var hicker = Hicker.instance()
	hicker.position = spawn.position
	add_child(hicker)


func _on_Area2D_area_entered(area):
	target = area

func fnc_sim():
	if places.size() + target.places.size() < 1:#carSpots:
		for place in target.places:
			places.append(place)
		print(places)
		print(places.size())
		close_dialog()
	else:
		change_dialog("Não tem espaço suficiente... Até mais", target.places[0])

func fnc_nao():
	close_dialog()

func close_dialog():
	pause = false
	target = null
	remove_child(dialog)
	dialog.queue_free()
	dialog = null

func change_dialog(message, name):
	print(message)
	remove_child(dialog)
	dialog.queue_free()
	dialog = null
	dialog = Talk.instance()
	dialog.find_node("Description").text = message
	dialog.find_node("Name").text = name
	dialog.position.x = 345
	dialog.position.y = 201
	dialog.z_index = 10
	add_child(dialog)
