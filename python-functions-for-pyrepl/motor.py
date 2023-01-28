import js, time

js.runPyREPL("import motor")

def motor_stop(port=-1):
    if port == -1:
        js.runPyREPL(f"motor.motor_stop()")
        return
    js.runPyREPL(f"motor.motor_stop({port})")
    
def motor_move_at_power(port, power):
    js.runPyREPL(f"motor.motor_move_at_power({port}, {power})")

def motor_move_at_speed(port, speed):
    js.runPyREPL(f"motor.motor_move_at_speed({port}, {speed})")

def motor_move_for_time(port, time, speed):
    js.runPyREPL(f"motor.motor_move_for_time({port}, {time}, {speed})")

def motor_move_by_degrees(port, degrees, speed):
    js.runPyREPL(f"motor.motor_move_by_degrees({port}, {degrees}, {speed})")

def motor_get_power(port):
    js.runPyREPL(f"print(motor.motor_get_power({port}))")
    time.sleep(0.1)
    return js.getPyREPL()

def motor_get_speed(port):
    js.runPyREPL(f"print(motor.motor_get_speed({port}))")
    time.sleep(0.1)
    return js.getPyREPL()


