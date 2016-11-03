void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (Serial.available() <= 0) {
    Serial.println("hello");
    delay(300);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available() > 0) {
    int forceSensor0 = analogRead(A0);
    int forceSensor1 = analogRead(A1);
    int forceSensor2 = analogRead(A2);
    int forceSensor3 = analogRead(A3);
    int forceSensor4 = analogRead(A4);

    //print test
    //  Serial.print("F1: ");
    //  Serial.print(forceSensor0);
    //  Serial.print(", ");
    //
    //  Serial.print("F2: ");
    //  Serial.print(forceSensor1);
    //  Serial.print(", ");
    //
    //  Serial.print("F3: ");
    //  Serial.print(forceSensor2);
    //  Serial.print(", ");
    //
    //  Serial.print("F4: ");
    //  Serial.print(forceSensor3);
    //  Serial.print(", ");
    //
    //  Serial.print("F5: ");
    //  Serial.print(forceSensor4);
    //  Serial.println(",");

    //P5 input
    if (forceSensor0 > 50||forceSensor1 > 50||forceSensor2 > 50||forceSensor3 > 50||forceSensor4 > 50) {
      Serial.print(forceSensor0);
      Serial.print(", ");

        Serial.print(forceSensor1);
        Serial.print(", ");
      
        Serial.print(forceSensor2);
        Serial.print(", ");
      
        Serial.print(forceSensor3);
        Serial.print(", ");
      
        Serial.print(forceSensor4);
        Serial.println(",");

    }
//    delay(100);
  }
}
