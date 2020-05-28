extends Node2D

var sim = false
var nao = false

func _on_Sim_pressed():
	get_parent().fnc_sim()

func _on_Nao_pressed():
	get_parent().fnc_sim()
