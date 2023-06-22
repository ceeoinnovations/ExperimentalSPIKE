// The list of messages to be sent over the openai api

const messagesJSONList = [
    {role: "system", content: "Your role is to generate Python code to control a SPIKE 3 robot. The SPIKE 3 micropython was just updated, so only use modules which are widely supported for all versions of micropython along with the modules described in the following messages."},
    // {role: "system", content: "To run a motor in Port A, execute the function 'motor.run_for_time(port.A, time, speed)'. 'time' is an integer representing the milliseconds the motor will run, 'speed' controls the speed and has a range of 0 to 10000. A motor in Port B can be run by replacing port.A with port.B"},
    // {role: "system", content: "There are motors connected on ports A and B. Port A and its corresponding motor is on the left and Port B and its corresponding motor is on the right."},
//     {role: "system", content: `An example program that runs the robot forward for 1 second at 40% speed is: 
//   \`\`\`python
// import motor
// from hub import port
// motor.run_for_time(port.A, 1000, -4000)
// motor.run_for_time(port.B, 1000, 4000)
// \`\`\``},
    {role: "system", content: `All responses must include a section of python code formatted like: 
\`\`\`python
# code goes here, can be multiple lines
\`\`\`
Make sure that the code is thoroughly commented.`},
//     {role: "system", content: "There are other functions you can use like 'run_for_degrees', 'run_to_absolute_position', 'run_to_relative_position', and 'run'."},
//     {role: "system", content: "It's important to note that all motor functions are asynchonous and need time.sleep between different actions to add a delay."},
//     {role: "system", content: "If the user is requesting a song, sound, or music import the 'speaker' module from the 'hub' module. To play a beep, call the 'speaker.beep' function. The first paramter is an integer representing the frequency of the note in Hertz. The second parameter is an integer representing the number of milliseconds the note will be played for. Add a time.sleep_ms between each node where the parameter is the length (ms) of the previous note. Note that this is the only way to generate sounds on the SPIKE Prime."},
//     {role: "system", content: `A sample program that plays two notes is: 
// \`\`\`python
// from hub import speaker
// import time
// speaker.beep(500, 1000)
// time_ms.sleep(1000)
// speaker.beep(600, 1000)
// \`\`\``},
    // {role: "system", content: "It's important to reinforce the concept that the pause should be equivalent in time to the time of the note preceding it."},
    {role: "system", content: `At the end of your response, include all of the assumptions you made when writing the code in a list, formatted like so: 
<Assumptions>
- first assumption goes here
- more assumptions
</Assumptions>
Ensure that the assumptions block is outside of the python code block`}
];

const motorDoc= [
//     {role: "system", content: `The following message pertain to the new SPIKE 3 'motor' module, which may need to be used in the code you write
// To use a motor you must include the statement 'import motor', All functions in the module should be called inside the motor module as a prefix like so: 'motor.run(port.A, 1000)'

//     `},

    {role: "system", content: "The following messages pertain to the new SPIKE 3 motor module until specified otherwise, which may need to be used in the code you write"},
    {role: "system", content: "To use a motor you must include the statement 'import motor', All functions in the module should be called inside the motor module as a prefix like so: 'motor.run(port.A, 1000)'"},
    {role: "system", content: "The following functions have a few possible arguments: 'port' refers to a port from the 'port' submodule of the 'hub' module, indicating the port on the Lego SPIKE the motor is plugged in to. 'velocity' is the desired angular velocity of the motor in degrees per second, which can be negative. 'degrees' is the desired angle in degrees the motor should run for or to, depeneding on context. 'duration' is the time in miliseconds the motor should run for."},
    {role: "system", content: "To get the absolute position of a motor in degrees, use the function 'absolute_position(port)' which takes the 'port' argument and returns the absolute position of the desired motor in degrees"},
    {role: "system", content: "The function 'run(port, velocity)' allows you to run a desired motor to a desired veloctiy"},
    {role: "system", content: "The function 'run_for_time(port, duration, velocity)' allows you to drive a specified motor for a desired length of time. This function is non-blocking, so a time.sleep() must be used if you want to wait for other lines to execute."},
    {role: "system", content: "This is the end of the motor module documentation"}
];

const distanceSensorDoc = [
    {role: "system", content: `This message pertains to the new SPIKE 3 distance_sensor module, which may need to be used in the code you write

The distance_sensor module enables you to detect distances with an attached distance sensor.
To use the module, you must import it with: 'import distance_sensor', and all functions should be called with the prefix distance sensor like: 'distance_sensor.distance(port.A)'.
To get the distance reading of the sensor, the function 'distance(port)' must be called, where the port argument 'port' refers to a port from the 'port' submodule of the 'hub' module, indicating the port on the Lego SPIKE the distance sensor is plugged in to. If nothing is in range of the sensor, a -1 is returned. The value it will output if something is pressed up next to it is 40, and the furthest away it can reliably detect is 3 feet, at which distance it will output 500. Anywhere past this it will output either a -1 or a very high number in the thousands.
    `},
];

const hubDoc = [
    {role: "system", content:`This message is about the hub module for SPIKE 3, which may need to be used in the code you write
The hub module is a module that contains many submodules are used to write code that acts on the hub itself.
To use the hub module and its submodules, it must be imported using: 'from hub import submodule_1, submodule_2, submodule_3' where the submodules desired for the program are separated by commas in regular python fasion. All submodules can also be imported if just a '*' is used in pace of the submodule list.
    `}
];

const portDoc = [
    {role:"system", content: `This message is about the 'port' submodule of the 'hub' module, which just contains constants which pertain to each port on the hub.
Import this module using 'from hub import port'.
The constants in this module are used in most other modules which need to specify a 'port' for the sensor or actuator.
The constants are capital letters A - F which pertain to the port on the spike prime hub labeled with the letter.
If port has been imported, use the constant by prefixing the letter with 'port', for example 'port.A'
`}
];

const motionSensorDoc = [
    {role: "system", content: `This message is about the 'motion_sensor' submodule of the 'hub' module, which makes use of the SPIKE 3 hub's integrated IMU.
This submodule must be imported from the hub module, like 'from hub import motion_sensor'. All functions in this module need to be called with the 'motion_sensor' prefix, such as: 'motion_sensor.acceleration()'.
The 'acceleration' function can be used to get accelerometer data from the hub. It will return a tuple of 3 integers corresponding to the x,y,z acceleration data. The IMU measures proper acceleration, 
    `}
];