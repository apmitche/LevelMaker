package com.huskygamedesign.magnets;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;
/**
 * Level loader that imports a file and creates a level using this text file.
 * 
 * @author Alicia
 *
 */
public class LevelLoader {

	Context _resources;

	/**
	 * Constructor for the level loader. 
	 * 
	 * @param r Entities
	 */
	public LevelLoader(Context r){
		_resources = r;
	}

	/**
	 * Loads a level from the passed file.
	 * 
	 * @param level A text file specifying where each entity is to be placed.
	 * @return The current level.
	 * @throws IOException If the file is not found.
	 */
	public Level loadLevel(String level){

		//Import Textures and Tilesheets
		Bitmap entities = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.entitytileset); // entity tilesheet
		Bitmap ballText = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.lighting); // ball texture
		Bitmap wallText = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.tileset); // wall tilesheet
		Bitmap magnetsText = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.mag50); // Assorted magnets tilesheet
		
		// Make Tilesheets
		Tilesheet entitySheet = new Tilesheet(entities, 50, 50);
		Tilesheet wallSheet = new Tilesheet(wallText, 50, 50);
		Tilesheet magnets = new Tilesheet(magnetsText, 50, 50);
		
		//Individual Entities
		Bitmap hole = entitySheet.getImageAt(3, 2);				// Game Over Hole
		Bitmap holeEntered = entitySheet.getImageAt(2, 2);		// Game Over Hole Un-entered
		Bitmap victorySpace = entitySheet.getImageAt(0, 0);		// Victory Hole
		
		
		Bitmap wallTopRightCorner = wallSheet.getImageAt(1, 0);	// Wall - Corner Top Right
		Bitmap wallTopLeftCorner = wallSheet.getImageAt(3, 0);	// Wall - Corner Top Left
		Bitmap wallBottomRightCorner = wallSheet.getImageAt(3, 2);// Wall - Corner Bottom Right
		Bitmap wallBottomLeftCorner = wallSheet.getImageAt(1, 2);// Wall - Corner Bottom Left
		
		Bitmap wallTop = wallSheet.getImageAt(2, 0);			// Wall - Top
		Bitmap wallLeft = wallSheet.getImageAt(1, 1);			// Wall - Left 
		Bitmap wallRight = wallSheet.getImageAt(3, 1);			// Wall - Right
		Bitmap wallBottom = wallSheet.getImageAt(2, 2);			// Wall - Bottom
		
		Bitmap wallBox = wallSheet.getImageAt(3, 3);			// Wall - Box
		
		// Floors and backgrounds
		//Bitmap floor = wallSheet.getImageAt(0, 0);
		
		// Import the level and load it
		Level currentLevel = new Level();
		
		try{

			InputStream in = _resources.getAssets().open(level);;
			Scanner s = new Scanner(in);
			s.useDelimiter(",:"); 
			
			// Place and add the floors and walls to the entity list FIRST before entities
			char index;
			int line = 0;
			Point currentPoint = new Point(0,0);
			while(s.hasNextLine()){
				String str = s.nextLine();
				
				for (int i = 0; i < str.length(); i++) {
					index = str.charAt(i);
					currentPoint.x = i*50;
					currentPoint.y = line *50;


					if(in.equals('w')){
						currentLevel.addEntity(new Wall(currentPoint, wallBox, true));
					}
					
					if(in.equals('o')){
						// Skip because it's a blank floor space
					}
				}

			}
			
			// Place Entities Based on the Passed X and Y values - more can be added as needed, just
			// using these couple for a starting point.
			String entitymark = null;
			int placeX = 0;
			int placeY = 0;
			Log.v("LevelLoader", "Before while loop");
			while (true){
				
				// Get next marker
				if (s.hasNext()){
					entitymark = s.next();
				}
				
				// Get X value
				if (s.hasNextInt()){
					placeX = s.nextInt();
				}
				
				// Get Y value
				if (s.hasNextInt()){
					placeY = s.nextInt();
				}
			
				// Check Entities and Place Entities
				if (entitymark == "b"){
					
					Point temp = new Point(placeX, placeY);
					currentLevel.addEntity(new Ball(temp, ballText));						
				}
				
				if(entitymark == "h"){
					Point temp = new Point(placeX, placeY);
					currentLevel.addEntity(new Hole(temp, hole, holeEntered, true));
				}
				
				if(entitymark == "v"){
					Point temp = new Point(placeX, placeY);
					currentLevel.addEntity(new VictorySpace(temp, victorySpace));
				}
				
				if(entitymark == "t"){
					Point temp = new Point(placeX, placeY);
					currentLevel.addEntity(new Trigger(temp, wallBottom, wallBottom, null));
				}
				
				if (!s.hasNextLine())
					break;
			}
			Log.v("LevelLoader", "After while loop");
		} catch (IOException error){
			error.printStackTrace();
			return null;
		}
		
		return currentLevel;
	}
}
