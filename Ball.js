package com.huskygamedesign.magnets;

import org.jbox2d.collision.shapes.CircleShape;
import org.jbox2d.common.Vec2;
import org.jbox2d.dynamics.FixtureDef;

import android.graphics.*;
import android.util.Log;
import android.widget.LinearLayout;
import android.app.Activity;
import android.content.res.Resources;
import com.huskygamedesign.magnets.R;

/**The primary object that the player guides throughout the game.
 * @author Alicia
 */
public class Ball extends Entity {

	Bitmap _ball;

	/**
	 * Create a new ball with the required specifications.
	 * 
	 * @param position Position of the ball.
	 * @param texture Texture of the ball.
	 */
	public Ball(Point position, Bitmap texture){
		
		super(initBall(texture), Entity.pixelsToMeters(position), texture.getWidth(), texture.getHeight(), EntityType.EntityTypeBall);
		_ball = texture;
	}

	/**
	 * Set the ball's specifications.
	 * 
	 * @param texture The texture to use to get the height.
	 * @return Specifications of the ball. Radius, Shape, Density, Friction, and Restitution.
	 */
	public static FixtureDef initBall(Bitmap texture){
		CircleShape cs = new CircleShape();
		cs.m_radius = Entity.pixelToMeter((texture.getWidth() / 2));
		FixtureDef fixture = new FixtureDef();
		fixture.shape = cs;
		fixture.density = 0.9f;
		fixture.friction = .5f;
		fixture.restitution = .7f;
		
		return fixture;
	}

	/**
	 *  Change ball from frame to frame
	 *  @param dT Amount of time that has passed since the last update
	 */
	@Override
	void update(float dT) {
		// TODO Auto-generated method stub
	}

	/** Called when the entity should draw itself to the screen
	 * @param canvas The canvas for which to draw to
	 */
	@Override
	void draw(Canvas canvas) {
		canvas.drawBitmap(_ball, getPosition().x, getPosition().y, null);
	}


}
